# 🖼️ Text → Image AI App

A React web app that turns text prompts into AI-generated images using **Stable Diffusion XL** via the Hugging Face Inference API. Type any idea, pick a quality preset, and get a stunning visual in seconds.

## ✨ Features

- 🎨 **Stable Diffusion XL** image generation via Hugging Face + nscale provider
- ⚡ **3 Quality Presets** — Fast (~15s), Balanced (~30s), High (~60s)
- 💡 **Example Prompts** — one-click inspiration to get started
- 📥 **Download** generated images directly to your device
- 🔄 **Regenerate** with the same prompt in one click
- 🧮 **Character counter** with 500 char limit on prompts
- ⌨️ **Keyboard shortcut** — `Cmd+Enter` to generate
- 💅 Smooth loading states, shimmer effects, and error handling

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend UI |
| Vite | Build tool & dev server |
| Hugging Face Inference JS | AI image generation API |
| Stable Diffusion XL | Image generation model |
| CSS | Custom styling & animations |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A free [Hugging Face](https://huggingface.co) account + API token

### Installation

```bash
git clone https://github.com/Thermodynamics0/text-to-image-app.git
cd text-to-image-app
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_HF_TOKEN=your_huggingface_token_here
```

Get your free token at → [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

> ⚠️ Never commit your `.env` file — it's already in `.gitignore`.

### Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 How It Works

1. Enter a text description of the image you want
2. Choose a quality preset (Fast / Balanced / High)
3. Hit **Generate Image** or press `Cmd+Enter`
4. The app calls Hugging Face's Inference API with Stable Diffusion XL
5. Your image appears — download or regenerate instantly

## 🌐 Live Demo

🔗 [View Live App](#) *(coming soon)*

---

Made with ❤️ by [Thermodynamics0](https://github.com/Thermodynamics0)
