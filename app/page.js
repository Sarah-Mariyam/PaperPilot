"use client";

import { useState, useEffect } from "react";
import { generateSummary, askQuestion } from "./ai";

export default function Home() {
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [fileName, setFileName] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [status, setStatus] = useState("");
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const loadPdfJs = async () => {
      const pdfjs = await import("pdfjs-dist/build/pdf");
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    };
    loadPdfJs();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !pdfjsLib) return;

    setFileName(file.name);
    setSummary("");
    setKeyPoints([]);
    setAnswer("");
    setStatus("Extracting text...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      setPdfText(fullText.slice(0, 30000));
      setStatus(`${pdf.numPages} pages ready`);
    } catch (error) {
      console.error(error);
      setStatus("Failed to read PDF");
      alert("Could not read this PDF. Please try another file.");
    }
  };

  const handleSummarize = async () => {
    if (!pdfText) {
      alert("Please upload a PDF first");
      return;
    }

    setLoading(true);
    setStatus("Analyzing paper...");

    try {
      const result = await generateSummary(pdfText);
      setSummary(result.summary);
      setKeyPoints(result.keyPoints);
      setStatus("Analysis complete");
    } catch (error) {
      console.error(error);
      setStatus("Analysis failed");
      alert("Something went wrong while generating the summary.");
    }

    setLoading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      alert("Please type a question");
      return;
    }
    if (!pdfText) {
      alert("Please upload a PDF first");
      return;
    }

    setAsking(true);
    setAnswer("");

    try {
      const result = await askQuestion(pdfText, question);
      setAnswer(result);
    } catch (error) {
      console.error(error);
      setAnswer("Sorry, something went wrong while answering your question.");
    }

    setAsking(false);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans antialiased">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-500/20">
              P
            </div>
            <span className="font-semibold tracking-tight text-[15px]">
              PaperPilot
            </span>
          </div>
          <div className="text-xs text-white/40 tracking-wide">
            Impact Forge 2026
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Understand any research paper
          </h1>
          <p className="text-white/45 text-sm leading-relaxed max-w-xl">
            Upload a PDF and get a clear summary, key insights, and answers to
            your questions — powered by open-source models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            {/* Upload Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm font-medium text-white/70 mb-4">
                Upload Paper
              </h2>

              <label className="group flex flex-col items-center justify-center w-full h-40 border border-dashed border-white/15 rounded-xl cursor-pointer hover:border-violet-500/40 hover:bg-violet-500/[0.03] transition-all duration-200">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-violet-500/10 transition">
                    <svg
                      className="w-5 h-5 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-white/60">
                    <span className="text-violet-400 font-medium">
                      Click to upload
                    </span>
                  </p>
                  <p className="text-xs text-white/25 mt-1">PDF files only</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {fileName && (
                <div className="mt-4 p-3 rounded-lg bg-white/[0.04] border border-white/10">
                  <p className="text-sm text-white/90 truncate">{fileName}</p>
                  <p className="text-xs text-white/35 mt-1">{status}</p>
                </div>
              )}

              <button
                onClick={handleSummarize}
                disabled={loading || !pdfText}
                className="mt-4 w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-500/10"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Generate Summary"
                )}
              </button>
            </div>

            {/* Ask Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm font-medium text-white/70 mb-4">
                Ask a Question
              </h2>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is the main contribution of this paper?"
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
              />
              <button
                onClick={handleAsk}
                disabled={asking || !pdfText}
                className="mt-3 w-full h-10 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition"
              >
                {asking ? "Thinking..." : "Ask PaperPilot"}
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-5">
            {!summary && !answer && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-7 h-7 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No paper analyzed yet
                </h3>
                <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
                  Upload a research paper to get a clear summary, key points,
                  and the ability to ask questions.
                </p>
              </div>
            )}

            {summary && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                    <h2 className="text-sm font-medium text-white/70">
                      Summary
                    </h2>
                  </div>
                  <button
                    onClick={() => copyToClipboard(summary, "summary")}
                    className="text-xs text-white/40 hover:text-white/70 transition flex items-center gap-1.5"
                  >
                    {copied === "summary" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-white/80 leading-relaxed text-[15px]">
                  {summary}
                </p>
              </div>
            )}

            {keyPoints.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></div>
                  <h2 className="text-sm font-medium text-white/70">
                    Key Points
                  </h2>
                </div>
                <div className="space-y-3.5">
                  {keyPoints.map((point, index) => (
                    <div key={index} className="flex gap-3.5 items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white/60">
                        {index + 1}
                      </div>
                      <p className="text-white/75 text-[15px] pt-0.5 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {answer && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <h2 className="text-sm font-medium text-white/70">
                      Answer
                    </h2>
                  </div>
                  <button
                    onClick={() => copyToClipboard(answer, "answer")}
                    className="text-xs text-white/40 hover:text-white/70 transition flex items-center gap-1.5"
                  >
                    {copied === "answer" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-white/80 leading-relaxed text-[15px]">
                  {answer}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">How to use PaperPilot</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-white/40 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-white/70 leading-relaxed">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <p>Upload any research paper PDF using the upload area.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <p>
                  Click <strong className="text-white">Generate Summary</strong>{" "}
                  to get a clear explanation and key points.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <p>Ask any question about the paper in the question box.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-medium">
                  4
                </span>
                <p>
                  Use the <strong className="text-white">Copy</strong> buttons
                  to save the summary or answer.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full h-10 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
