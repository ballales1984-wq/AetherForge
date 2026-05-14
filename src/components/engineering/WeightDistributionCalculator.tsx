"use client";

import { useState } from "react";

interface WeightInputs {
  totalMass: number;
  wheelbase: number;
  frontWeightPercent: number;
  heightCog: number;
}

interface WeightOutputs {
  frontWeight: number;
  rearWeight: number;
  frontAxleLoad: number;
  rearAxleLoad: number;
  weightTransfer: number;
}

export function WeightDistributionCalculator() {
  const [inputs, setInputs] = useState<WeightInputs>({
    totalMass: 1500,
    wheelbase: 2.8,
    frontWeightPercent: 45,
    heightCog: 0.5,
  });

  const [outputs, setOutputs] = useState<WeightOutputs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/engineering/weight/distribution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutputs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setOutputs(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded flex items-center justify-center text-white text-sm mr-3">
          ⚖️
        </span>
        Weight Distribution Calculator
      </h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        calculate();
      }} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Total Mass (kg)
            </label>
            <input
              type="number"
              value={inputs.totalMass}
              onChange={(e) => setInputs({ ...inputs, totalMass: parseFloat(e.target.value) || 0 })}
              min="1"
              step="1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Wheelbase (m)
            </label>
            <input
              type="number"
              value={inputs.wheelbase}
              onChange={(e) => setInputs({ ...inputs, wheelbase: parseFloat(e.target.value) || 0 })}
              min="0.1"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Front Weight (%)
            </label>
            <input
              type="number"
              value={inputs.frontWeightPercent}
              onChange={(e) => setInputs({ ...inputs, frontWeightPercent: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              CG Height (m)
            </label>
            <input
              type="number"
              value={inputs.heightCog}
              onChange={(e) => setInputs({ ...inputs, heightCog: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Calculating..." : "Calculate Distribution"}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-md">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      
      {outputs && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded flex items-center justify-center text-white text-sm mr-2">
              ⚖️
            </span>
            Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p className="text-sm">Front Weight</p>
              <p className="text-2xl font-bold text-white">{outputs.frontWeight.toFixed(1)} kg</p>
            </div>
            
            <div>
              <p className="text-sm">Rear Weight</p>
              <p className="text-2xl font-bold text-white">{outputs.rearWeight.toFixed(1)} kg</p>
            </div>
            
            <div>
              <p className="text-sm">Front Axle Load</p>
              <p className="text-2xl font-bold text-white">{outputs.frontAxleLoad.toFixed(0)} N</p>
            </div>
            
            <div>
              <p className="text-sm">Rear Axle Load</p>
              <p className="text-2xl font-bold text-white">{outputs.rearAxleLoad.toFixed(0)} N</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm">Weight Transfer (1g acceleration)</p>
              <p className="text-2xl font-bold text-white">{outputs.weightTransfer.toFixed(2)} kg</p>
              <p className="text-xs text-green-400">Load shift from rear to front under braking</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}