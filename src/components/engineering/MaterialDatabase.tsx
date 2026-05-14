"use client";

import { useState, useEffect } from "react";

interface Material {
  name: string;
  density: number; // kg/m³
  youngModulus: number; // GPa
  yieldStrength: number; // MPa
  costPerKg: number; // USD
}

interface MaterialComparison {
  materials: Material[];
}

export function MaterialDatabase() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [comparison, setComparison] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/engineering/materials/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const compareMaterials = async () => {
    if (selectedMaterials.length === 0) {
      setComparison([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/engineering/materials/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMaterials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compare materials");
      setComparison([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded flex items-center justify-center text-white text-sm mr-3">
          🧪
        </span>
        Material Database & Comparator
      </h2>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-md">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Materials List */}
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-500 rounded flex items-center justify-center text-white text-sm mr-2">
              📋
            </span>
            Available Materials ({materials.length})
          </h3>
          
          {loading ? (
            <p className="text-gray-400">Loading materials...</p>
          ) : (
            <div className="mt-2 space-y-2">
              {materials.map((material) => (
                <div key={material.name} className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-white">{material.name}</h4>
                    <p className="text-sm text-gray-400">
                      Density: {material.density.toLocaleString()} kg/m³ | 
                      E-Modulus: {material.youngModulus} GPa | 
                      Yield: {material.yieldStrength} MPa | 
                      Cost: ${material.costPerKg}/kg
                    </p>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMaterials([...selectedMaterials, material.name]);
                        } else {
                          setSelectedMaterials(selectedMaterials.filter(name => name !== material.name));
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 border-gray-600 rounded"
                    />
                    <span className="text-sm text-gray-300">Select for comparison</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Comparison Section */}
        {selectedMaterials.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <span className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-500 rounded flex items-center justify-center text-white text-sm mr-2">
                🔍
              </span>
              Comparison ({selectedMaterials.length} selected)
            </h3>
            
            <div className="mt-2">
              <button
                onClick={compareMaterials}
                disabled={loading || selectedMaterials.length < 2}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Comparing..." : "Compare Selected Materials"}
              </button>
            </div>
          </div>
        )}
        
        {/* Comparison Results */}
        {comparison.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <span className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-500 rounded flex items-center justify-center text-white text-sm mr-2">
                📊
              </span>
              Comparison Results
            </h3>
            
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-gray-900/50 border border-gray-700/50 rounded-lg">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Property</th>
                    {comparison.map((material) => (
                      <th key={material.name} className="text-left px-4 py-3 text-sm font-medium text-gray-300">
                        {material.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-700">
                    <td className="text-left px-4 py-3 text-sm font-medium text-gray-300">Density (kg/m³)</td>
                    {comparison.map((material) => (
                      <td key={material.name} className="text-left px-4 py-3 text-white">
                        {material.density.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="text-left px-4 py-3 text-sm font-medium text-gray-300">Young's Modulus (GPa)</td>
                    {comparison.map((material) => (
                      <td key={material.name} className="text-left px-4 py-3 text-white">
                        {material.youngModulus}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="text-left px-4 py-3 text-sm font-medium text-gray-300">Yield Strength (MPa)</td>
                    {comparison.map((material) => (
                      <td key={material.name} className="text-left px-4 py-3 text-white">
                        {material.yieldStrength}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="text-left px-4 py-3 text-sm font-medium text-gray-300">Cost ($/kg)</td>
                    {comparison.map((material) => (
                      <td key={material.name} className="text-left px-4 py-3 text-white">
                        ${material.costPerKg}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              
              <div className="mt-4 text-sm text-gray-400">
                <p><strong>Key Insights:</strong></p>
                <ul className="list-disc list-inside mt-1">
                  <li>
                    Lightest: 
                    {comparison.reduce((lightest, current) => 
                      current.density < lightest.density ? current : lightest
                    ).name} ({Math.min(...comparison.map(m => m.density)).toLocaleString()} kg/m³)
                  </li>
                  <li>
                    Stiffest: 
                    {comparison.reduce((stiffest, current) => 
                      current.youngModulus > stiffest.youngModulus ? current : stiffest
                    ).name} ({Math.max(...comparison.map(m => m.youngModulus))} GPa)
                  </li>
                  <li>
                    Strongest: 
                    {comparison.reduce((strongest, current) => 
                      current.yieldStrength > strongest.yieldStrength ? current : strongest
                    ).name} ({Math.max(...comparison.map(m => m.yieldStrength))} MPa)
                  </li>
                  <li>
                    Most Affordable: 
                    {comparison.reduce((cheapest, current) => 
                      current.costPerKg < cheapest.costPerKg ? current : cheapest
                    ).name} (${Math.min(...comparison.map(m => m.costPerKg)).toFixed(2)}/kg)
                  </li>
                </ul>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}