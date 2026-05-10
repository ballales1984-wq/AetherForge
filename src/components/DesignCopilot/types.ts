export interface ParamState {
  length: number;
  height: number;
  wheelbase: number;
  trackWidth: number;
  wheelDiameter: number;
}

export interface DesignSuggestion {
  issue: string;
  severity: "info" | "warning" | "critical";
  suggestion: string;
  affected_component: string;
}

export interface DesignAnalysisResponse {
  overall_score: number;
  proportions_ok: boolean;
  design_character: string;
  estimated_category: string;
  suggestions: DesignSuggestion[];
}

export interface SketchPath {
  points: { x: number; y: number }[];
  tool: "pen" | "eraser";
  timestamp: number;
}
