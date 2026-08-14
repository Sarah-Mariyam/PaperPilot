# PaperPilot

**Understand any research paper in minutes.**

PaperPilot is a web application that helps students quickly understand research papers. Upload a PDF and get:

- A clear, simple summary
- Key points from the paper
- The ability to ask questions about the content

Built for the **Impact Forge 2026** hackathon.

## Features

- Upload any research paper (PDF)
- Clear summary written in simple language
- Extracted key points
- Ask questions about the paper
- Clean, modern dark UI
- Copy buttons for summary and answers
- Fully client-side PDF text extraction using pdfjs-dist
- Modular architecture (page.js + ai.js)

## Tech Stack

- Frontend: Next.js (App Router) + JavaScript
- Styling: Tailwind CSS
- PDF Processing: pdfjs-dist (runs entirely in the browser)
- AI Integration: Featherless.ai (OpenAI-compatible) — ready for real API key
- Model prepared: Qwen/Qwen2.5-7B-Instruct

## Project Structure

paperpilot/
├── app/
│ ├── ai.js # All AI logic + Featherless integration
│ ├── page.js # Main UI and application logic
│ ├── layout.js
│ └── globals.css
├── .env.local # API key (not committed)
├── package.json
└── README.md

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sarah-Mariyam/PaperPilot.git
cd PaperPilot

npm install

npm run dev

Open http://localhost:3000

How It Works

User uploads a research paper (PDF)
pdfjs-dist extracts the text directly in the browser
The text is processed by the AI engine in ai.js
A structured summary + key points are generated
Users can ask follow-up questions about the same paper

The AI layer is cleanly separated in app/ai.js, making it easy to switch from fallback mode to real Featherless inference.
Current Status

Full working prototype with PDF upload, summary, key points, and Q&A
High-quality fallback responses (active by default)
Real Featherless.ai integration is fully implemented and ready
Clean modular code architecture
Modern premium dark UI

Author
Sarah Mariyam
Built for Impact Forge 2026 (Student Virtual Code Sprint)
```
