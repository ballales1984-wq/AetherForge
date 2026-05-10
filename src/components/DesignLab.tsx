"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function DesignLab() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: "llama-3.3-70b-versatile" }),
      });
      const data = await res.json();
      setResponse(data.text);
    } catch {
      setResponse("Error generating response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="lab" className="relative bg-[#050505] py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-100" />
        <div className="absolute bottom-1/3 left-1/3 h-72 w-72 rounded-full bg-purple-400/10 blur-100" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div data-reveal className="max-w-3xl">
          <p className="font-display text-sm uppercase tracking-wide text-cyan-300">Design Lab</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">Sketch, AI finishing, 3D and launch-grade storytelling.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div data-reveal>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4">AI Concept Generator</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your automotive concept... (e.g., 'A futuristic electric hypercar with gull-wing doors and adaptive aerodynamics')"
                className="w-full h-32 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20 resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-300 to-cyan-400 px-6 py-3 font-semibold text-black transition hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] disabled:opacity-50"
              >
                {isLoading ? "Generating..." : "Generate Concept"}
              </button>
            </div>
          </div>
          <div data-reveal>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 min-h-[200px]">
              <h3 className="font-display text-lg font-semibold text-white mb-3">Generated Output</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-pulse text-cyan-300">Generating...</div>
                </div>
              ) : response ? (
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{response}</p>
              ) : (
                <p className="text-white/40 italic">Your AI-generated concept will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}