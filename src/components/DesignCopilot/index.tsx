"use client";

import { useState, useCallback } from "react";
import SketchCanvas from "./SketchCanvas";
import ParametricPanel from "./ParametricPanel";
import AIAnalysisPanel from "./AIAnalysisPanel";
import { Preview3D } from "./Preview3D";
import type { ParamState, DesignAnalysisResponse } from "./types";

const DEFAULT_PARAMS: ParamState = {
  length: 4.5,
  height: 1.2,
  wheelbase: 2.7,
  trackWidth: 1.9,
  wheelDiameter: 0.75,
};

export function DesignCopilot() {
  const [params, setParams] = useState<ParamState>(DEFAULT_PARAMS);
  const [sketchData, setSketchData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<DesignAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleParamsChange = useCallback((newParams: ParamState) => {
    setParams(newParams);
  }, []);

  const handleSketchChange = useCallback((data: any) => {
    setSketchData(data);
  }, []);

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/ai/analyze-design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketch_description: sketchData ? "Hand-drawn automotive sketch with multiple strokes" : "No sketch provided",
          dimensions: params,
          vehicle_type: "custom",
        }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [params, sketchData]);

  return (
    <section id="copilot" className="relative bg-[#050505] py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-100" />
        <div className="absolute bottom-1/3 right-1/3 h-72 w-72 rounded-full bg-purple-400/10 blur-100" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div data-reveal className="mb-12 max-w-3xl">
          <p className="font-display text-sm uppercase tracking-wide text-cyan-300">AI Design Copilot</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              Sketch. Parameterize. Validate. Create.
            </span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Disegna a mano libera, definisci le quote tecniche, e lascia che l'AI supervisioni le proporzioni.
            Il tuo co-designer automobilistico personale.
          </p>
        </div>

        {/* Main Workspace */}
        <div data-reveal className="grid gap-8 lg:grid-cols-12">
          {/* Left: Sketch Canvas + 3D Preview */}
          <div className="space-y-8 lg:col-span-7">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">Sketch Canvas</h3>
                <div className="flex gap-2 text-xs">
                  <span className="rounded bg-cyan-900/30 px-2 py-1 text-cyan-200">Pen</span>
                  <span className="rounded bg-white/10 px-2 py-1 text-white/60">Eraser</span>
                </div>
              </div>
              <SketchCanvas onSketchChange={handleSketchChange} height={420} />
            </div>

            {/* 3D Preview */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 font-display text-lg font-semibold text-white">Real-time 3D Preview</h3>
              <Preview3D params={params} bodyColor="#06b6d4" />
            </div>
          </div>

          {/* Right: Panels */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Parametric Panel */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Parameters</h3>
              <ParametricPanel onParamsChange={handleParamsChange} initialParams={DEFAULT_PARAMS} />
            </div>

            {/* AI Analysis Panel */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">AI Design Review</h3>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 px-4 py-2 text-xs font-semibold text-black transition hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] disabled:opacity-50"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </button>
              </div>
              <AIAnalysisPanel analysis={analysis} isLoading={isAnalyzing} onRetry={handleAnalyze} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
