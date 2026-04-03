import { useState, useRef, useEffect } from 'react'
import { InferenceClient } from '@huggingface/inference'
import './App.css'

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN
const client = new InferenceClient(HF_TOKEN)

const EXAMPLE_PROMPTS = [
  'Neon-lit cyberpunk city at midnight, rain-soaked streets',
  'Serene Japanese garden in autumn, golden maple leaves, koi pond',
  'Astronaut riding a horse on Mars, cinematic dust storm lighting',
  'Cozy enchanted-forest cottage, lantern glow through windows',
]

const QUALITY_PRESETS = [
  { id: 'fast',     label: 'Fast',     steps: 15, guidance: 5.0, note: '~15s' },
  { id: 'balanced', label: 'Balanced', steps: 30, guidance: 7.5, note: '~30s' },
  { id: 'high',     label: 'High',     steps: 50, guidance: 9.0, note: '~60s' },
]

/* ── Icons ─────────────────────────────────────────────────────────── */
function SparkleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
      <path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z" />
      <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z" />
    </svg>
  )
}

function ImagePlaceholderIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  )
}

/* ── QualitySelector ─────────────────────────────────────────────── */
function QualitySelector({ value, onChange, disabled }) {
  return (
    <div className="panel-section">
      <span className="field-label">Quality</span>
      <div className="quality-grid" role="group" aria-label="Image quality">
        {QUALITY_PRESETS.map((p) => (
          <button
            key={p.id}
            className={`quality-pill ${value === p.id ? 'active' : ''}`}
            onClick={() => onChange(p.id)}
            disabled={disabled}
            aria-pressed={value === p.id}
            title={`${p.steps} steps · ${p.note}`}
          >
            {p.label}
            <span className="quality-note">{p.note}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── OutputPanel ─────────────────────────────────────────────────── */
function OutputPanel({ loading, error, imageUrl, lastPrompt, onRegenerate, quality }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  // Reset imgLoaded when new image starts
  useEffect(() => { if (imageUrl) setImgLoaded(false) }, [imageUrl])

  if (loading) {
    const note = QUALITY_PRESETS.find(p => p.id === quality)?.note
    return (
      <div className="output-panel">
        <div className="output-loading" role="status" aria-label="Generating image">
          <div className="spinner-rings">
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
            <div className="ring-orb" />
          </div>
          <p className="loading-label">Generating your image…</p>
          <p className="loading-sub">This may take {note}</p>
          <div className="progress-bar" aria-hidden="true">
            <div className="progress-fill" />
          </div>
        </div>
      </div>
    )
  }

  if (imageUrl) {
    return (
      <div className="output-panel">
        <div className="output-result">
          <div className="result-img-wrap">
            {!imgLoaded && <div className="result-shimmer" aria-hidden="true" />}
            <img
              src={imageUrl}
              alt={lastPrompt}
              className="result-img"
              onLoad={() => setImgLoaded(true)}
              style={imgLoaded ? {} : { opacity: 0, position: 'absolute' }}
            />
          </div>
          {imgLoaded && (
            <div className="result-meta">
              <span className="result-meta-label">Prompt</span>
              <p className="result-meta-prompt">"{lastPrompt}"</p>
            </div>
          )}
        </div>
        {error && (
          <div className="error-box" role="alert">
            <span className="error-icon" aria-hidden="true">⚠</span>
            {error}
          </div>
        )}
        <div className="result-actions">
          <a
            href={imageUrl}
            download="ai-generated.png"
            className="act-btn btn-download"
            aria-label="Download generated image"
          >
            <DownloadIcon /> Download
          </a>
          <button
            className="act-btn btn-regen"
            onClick={onRegenerate}
            aria-label="Regenerate with same prompt"
          >
            <RefreshIcon /> Regenerate
          </button>
        </div>
      </div>
    )
  }

  // Empty / error state
  return (
    <div className="output-panel">
      {error ? (
        <div className="output-empty">
          <div className="empty-icon">
            <span style={{ fontSize: '1.8rem' }}>⚠</span>
          </div>
          <p className="empty-title">Generation Failed</p>
          <p className="empty-sub">{error}</p>
        </div>
      ) : (
        <div className="output-empty">
          <div className="empty-icon">
            <ImagePlaceholderIcon />
          </div>
          <p className="empty-title">Your image will appear here</p>
          <p className="empty-sub">
            Describe any scene, style, or concept — the AI will render it for you.
          </p>
          <div className="empty-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── App ─────────────────────────────────────────────────────────── */
export default function App() {
  const [prompt, setPrompt]         = useState('')
  const [quality, setQuality]       = useState('balanced')
  const [loading, setLoading]       = useState(false)
  const [imageUrl, setImageUrl]     = useState(null)
  const [error, setError]           = useState(null)
  const [lastPrompt, setLastPrompt] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    return () => {
      if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const handleGenerate = async () => {
    const trimmed = prompt.trim()
    if (!trimmed) return
    const preset = QUALITY_PRESETS.find(p => p.id === quality)

    setLoading(true)
    setError(null)
    setImageUrl(null)
    setLastPrompt(trimmed)

    try {
      const blob = await client.textToImage({
        provider: 'nscale',
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        inputs: trimmed,
        parameters: { num_inference_steps: preset.steps, guidance_scale: preset.guidance },
      })
      setImageUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error('HF API error:', err)
      setError('Failed to generate image. Check your API token and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
  }

  const canGenerate = prompt.trim().length > 0 && !loading

  return (
    <div className="app">
      <div className="bg-mesh" aria-hidden="true" />

      {/* ── Top nav ── */}
      <nav className="topbar" aria-label="Site navigation">
        <div className="topbar-brand">
          <div className="topbar-logo" aria-hidden="true">
            <SparkleIcon size={18} />
          </div>
          <span className="topbar-name">
            Text<span>→</span>Image
          </span>
        </div>
        <div className="topbar-badge" aria-label="AI powered">
          <span className="badge-pulse" />
          Stable Diffusion XL
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="hero">
        <p className="hero-eyebrow">AI Image Generator</p>
        <h1 className="hero-title">
          Turn any idea into<br />
          <span className="grad">stunning visuals</span>
        </h1>
        <p className="hero-sub">
          Describe a scene, style, or concept in plain language — our AI renders it in seconds.
        </p>
        <div className="hero-tags" aria-hidden="true">
          {['Photorealistic', 'Cinematic', 'Abstract', 'Fantasy', 'Cyberpunk', 'Anime'].map(t => (
            <span key={t} className="hero-tag">{t}</span>
          ))}
        </div>
      </header>

      {/* ── Two-column workspace ── */}
      <div className="workspace">

        {/* Left: control panel */}
        <aside aria-label="Generation controls">
          <div className="panel">

            {/* Prompt */}
            <div className="panel-section">
              <label htmlFor="prompt-input" className="field-label">Describe your image</label>
              <div className="textarea-shell">
                <textarea
                  id="prompt-input"
                  ref={textareaRef}
                  className="prompt-textarea"
                  placeholder="A majestic dragon soaring over snow-capped mountains at golden hour…"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={5}
                  maxLength={500}
                  disabled={loading}
                  aria-describedby="char-count generate-hint"
                />
              </div>
              <div className="textarea-footer">
                <span id="char-count" className="char-count">{prompt.length}/500</span>
                <span id="generate-hint" className="kbd-hint">
                  <kbd>⌘</kbd><kbd>↵</kbd>&nbsp;generate
                </span>
              </div>
            </div>

            {/* Quality */}
            <QualitySelector value={quality} onChange={setQuality} disabled={loading} />

            {/* Generate CTA */}
            <button
              id="generate-btn"
              className="generate-btn"
              onClick={handleGenerate}
              disabled={!canGenerate}
              aria-busy={loading}
            >
              {loading ? (
                <><span className="btn-spinner" aria-hidden="true" />Generating…</>
              ) : (
                <><SparkleIcon />Generate Image</>
              )}
            </button>

            {/* Examples */}
            {!loading && (
              <div className="panel-section">
                <span className="examples-label">Try an example</span>
                <div className="examples-list" role="list">
                  {EXAMPLE_PROMPTS.map((ex, i) => (
                    <button
                      key={i}
                      role="listitem"
                      className="example-chip"
                      onClick={() => { setPrompt(ex); textareaRef.current?.focus() }}
                      title={ex}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Right: output */}
        <main aria-label="Generated image output">
          <OutputPanel
            loading={loading}
            error={error}
            imageUrl={imageUrl}
            lastPrompt={lastPrompt}
            onRegenerate={handleGenerate}
            quality={quality}
          />
        </main>

      </div>
    </div>
  )
}
