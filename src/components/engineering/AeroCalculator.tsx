"use client";

import { useState } from "react";

interface AeroInputs {
  velocity: number;
  frontalArea: number;
  dragCoefficient: number;
  liftCoefficient: number;
}

interface AeroOutputs {
  dragForce: number;
  liftForce: number;
  powerRequired: number;
  efficiencyRatio: number;
}

export function AeroCalculator() {
  const [inputs, setInputs] = useState<AeroInputs>({
    velocity: 30,
    frontalArea: 2.0,
    dragCoefficient: 0.3,
    liftCoefficient: -0.5,
  });

  const [outputs, setOutputs] = useState<AeroOutputs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/engineering/aerodynamics/calculate`, {
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
        <span className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded flex items-center justify-center text-white text-sm mr-3">
          🌬️
        </span>
        Aerodynamics Calculator
      </h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        calculate();
      }} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Velocity (m/s)
            </label>
            <input
              type="number"
              value={inputs.velocity}
              onChange={(e) => setInputs({ ...inputs, velocity: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Frontal Area (m²)
            </label>
            <input
              type="number"
              value={inputs.frontalArea}
              onChange={(e) => setInputs({ ...inputs, frontalArea: parseFloat(e.target.value) || 0 })}
              min="0.1"
              step="0.1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Drag Coefficient (Cd)
            </label>
            <input
              type="number"
              value={inputs.dragCoefficient}
              onChange={(e) => setInputs({ ...inputs, dragCoefficient: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Lift Coefficient (Cl)
            </label>
            <input
              type="number"
              value={inputs.liftCoefficient}
              onChange={(e) => setInputs({ ...inputs, liftCoefficient: parseFloat(e.target.value) || 0 })}
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Calculating..." : "Calculate Forces"}
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
            <span className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded flex items-center justify-center text-white text-sm mr-2">
              📊
            </span>
            Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p className="text-sm">Drag Force</p>
              <p className="text-2xl font-bold text-white">{outputs.dragForce.toFixed(2)} N</p>
            </div>
            
            <div>
              <p className="text-sm">Lift Force</p>
              <p className="text-2xl font-bold text-white">{outputs.liftForce.toFixed(2)} N</p>
              {outputs.liftForce < 0 && (
                <p className="text-xs text-green-400">(downforce)</p>
              )}
            </div>
            
            <div>
              <p className="text-sm">Power Required</p>
              <p className="text-2xl font-bold text-white">{outputs.powerRequired.toFixed(0)} W</p>
            </div>
            
            <div>
              <p className="text-sm">Efficiency (L/D)</p>
              <p className="text-2xl font-bold text-white">{outputs.efficiencyRatio.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}