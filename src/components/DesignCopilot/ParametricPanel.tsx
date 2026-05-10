"use client";

import { useState, useEffect, useCallback } from "react";
import type { ParamState } from "./types";

interface Props {
  onParamsChange: (params: ParamState) => void;
  initialParams?: Partial<ParamState>;
}

const DEFAULTS: ParamState = {
  length: 4.5,
  height: 1.2,
  wheelbase: 2.7,
  trackWidth: 1.9,
  wheelDiameter: 0.75,
};

const RANGES = {
  length: { min: 3.5, max: 6.5, typical: 4.5, label: "Length" },
  height: { min: 0.9, max: 2.0, typical: 1.2, label: "Height" },
  wheelbase: { min: 2.2, max: 4.0, typical: 2.7, label: "Wheelbase" },
  trackWidth: { min: 1.4, max: 2.4, typical: 1.9, label: "Track width" },
  wheelDiameter: { min: 0.5, max: 1.1, typical: 0.75, label: "Wheel diameter" },
};

export function ParametricPanel({ onParamsChange, initialParams = {} }: Props) {
  const [params, setParams] = useState<ParamState>({ ...DEFAULTS, ...initialParams });
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  const validate = useCallback((p: ParamState) => {
    const w: Record<string, string> = {};

    const wheelToHeightRatio = p.wheelDiameter / p.height;
    if (wheelToHeightRatio < 0.3) w.wheelDiameter = "Wheels too small";
    if (wheelToHeightRatio > 0.5) w.wheelDiameter = "Wheels oversized";

    const wbToLength = p.wheelbase / p.length;
    if (wbToLength < 0.5) w.wheelbase = "Short wheelbase";
    if (wbToLength > 0.65) w.wheelbase = "Long wheelbase";

    const hToLength = p.height / p.length;
    if (hToLength > 0.35) w.height = "Too tall";
    if (hToLength < 0.20) w.height = "Very low";

    const trackToLength = p.trackWidth / p.length;
    if (trackToLength < 0.42) w.trackWidth = "Narrow track";
    if (trackToLength > 0.55) w.trackWidth = "Very wide track";

    setWarnings(w);
    return w;
  }, []);

  useEffect(() => {
    onParamsChange(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    validate(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateField = (field: keyof ParamState, value: number) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const ratios = {
    "L/H": (params.height / params.length * 100).toFixed(0),
    "WB/L": (params.wheelbase / params.length * 100).toFixed(0),
    "Track/L": (params.trackWidth / params.length * 100).toFixed(0),
    "Wheel/H": (params.wheelDiameter / params.height * 100).toFixed(0),
  };

  const applyPreset = (preset: "hypercar" | "suv" | "sedan" | "custom") => {
    switch (preset) {
      case "hypercar":
        setParams({ length: 4.8, height: 1.05, wheelbase: 2.8, trackWidth: 2.1, wheelDiameter: 0.82 });
        break;
      case "suv":
        setParams({ length: 4.9, height: 1.75, wheelbase: 2.9, trackWidth: 1.85, wheelDiameter: 0.78 });
        break;
      case "sedan":
        setParams({ length: 4.6, height: 1.35, wheelbase: 2.75, trackWidth: 1.6, wheelDiameter: 0.67 });
        break;
      case "custom":
        setParams(DEFAULTS);
        break;
    }
  };

  return (
    <div className="space-y-5">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {(["hypercar", "suv", "sedan", "custom"] as const).map((p) => (
          <button
            key={p}
            onClick={() => applyPreset(p)}
            className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/70 hover:border-cyan-400 hover:text-cyan-300 transition capitalize"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input fields */}
      {(Object.keys(RANGES) as Array<keyof ParamState>).map((key) => {
        const range = RANGES[key];
        const value = params[key];
        const warning = warnings[key];
        const hasWarning = !!warning;

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-white/70">{range.label}</label>
              <span className={`font-mono ${hasWarning ? "text-yellow-400" : "text-cyan-300"}`}>
                {value.toFixed(2)} m
              </span>
            </div>

            {/* Slider + numeric input */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={range.min}
                max={range.max}
                step={0.01}
                value={value}
                onChange={(e) => updateField(key, parseFloat(e.target.value))}
                className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer ${hasWarning ? "accent-yellow-400" : "accent-cyan-400"}`}
                style={{
                  background: `linear-gradient(to right, ${hasWarning ? "#facc15" : "#06b6d4"} 0%, ${hasWarning ? "#facc15" : "#06b6d4"} ${((value - range.min) / (range.max - range.min)) * 100}%, rgba(255,255,255,0.1) ${((value - range.min) / (range.max - range.min)) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <input
                type="number"
                min={range.min}
                max={range.max}
                step={0.01}
                value={value.toFixed(2)}
                onChange={(e) => updateField(key, parseFloat(e.target.value) || 0)}
                className={`w-20 rounded border bg-black/30 px-2 py-1 text-right text-xs font-mono text-white transition ${
                  hasWarning ? "border-yellow-500/50 text-yellow-300" : "border-white/20 text-cyan-300"
                } focus:outline-none focus:ring-1 focus:ring-cyan-400`}
              />
            </div>

            {/* Warning */}
            {hasWarning && (
              <p className="text-xs text-yellow-400 italic">{warning}</p>
            )}
          </div>
        );
      })}

      {/* Ratios */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="mb-2 text-xs text-white/50 uppercase tracking-wider">Proportional Ratios</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(ratios).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded bg-white/5 px-2 py-1.5">
              <span className="text-white/60">{label}</span>
              <span className="font-mono text-cyan-300">{value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
   );
 }

export default ParametricPanel;
