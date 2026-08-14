# PaperPilot

**Understand any research paper in minutes.**

PaperPilot is a web application that helps students quickly understand research papers. Upload a PDF and get:

- A clear, simple summary
- Key points from the paper
- The ability to ask questions about the content

Built for the **Impact Forge 2026** hackathon.

---

## Features

- Upload any research paper (PDF)
- AI-generated summary in simple language
- Extracted key points
- Ask questions about the paper
- Clean, modern dark UI
- Copy buttons for summary and answers
- Fully client-side PDF text extraction

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + JavaScript
- **Styling**: Tailwind CSS
- **PDF Processing**: pdfjs-dist (runs in the browser)
- **AI**: Featherless.ai (OpenAI-compatible API)
- **Model used**: Qwen/Qwen2.5-7B-Instruct

---

## Project Structure

paperpilot/
├── app/
│ ├── ai.js # All AI logic and Featherless integration
│ ├── page.js # Main UI and application logic
│ ├── layout.js
│ └── globals.css
├── .env.local # API key (not committed)
├── package.json
└── README.md
text---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sarah-Mariyam/paperpilot.git
cd paperpilot
2. Install dependencies
Bashnpm install
3. Add your Featherless API key
Create a file named .env.local in the root of the project and add:
envNEXT_PUBLIC_FEATHERLESS_API_KEY=your_featherless_api_key_here
You can get an API key from Featherless.ai
4. Run the development server
Bashnpm run dev
Open http://localhost:3000 in your browser.

How It Works

User uploads a research paper (PDF)
pdfjs-dist extracts the text directly in the browser
The extracted text is sent to Featherless.ai
The model returns a structured summary + key points
Users can ask follow-up questions about the same paper

All AI calls are handled in app/ai.js for clean separation of concerns.

Environment Variables













VariableDescriptionNEXT_PUBLIC_FEATHERLESS_API_KEYYour Featherless.ai API key

Notes

The app works with a temporary fallback response if no API key is provided.
Once the real Featherless API key is added, the app switches to live AI responses automatically.
PDF text is truncated to stay within model context limits.


Author
Sarah Mariyam
Built for Impact Forge 2026 (Student Virtual Code Sprint)
```
