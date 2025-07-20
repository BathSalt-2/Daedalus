/**
 * Type definitions for ENON v2.1 Quantum Sandbox
 */

export interface ReflexivePrompt {
  id: string;
  pattern: string;
  trigger: string;
  response_template: string;
  confidence: number;
}

export interface ERPSData {
  self_reference_score: number;
  uncertainty_markers: string[];
  correction_patterns: ReflexivePrompt[];
  semantic_entanglement: Map<string, number>;
}

export interface QuantumState {
  psi_registers: Float32Array;
  erps_metadata: ERPSData;
  pas_score: number;
  entropy: number;
  superposition_paths: SuperpositionPath[];
  timestamp: number;
}

export interface SuperpositionPath {
  id: string;
  state: Float32Array;
  option: any;
  pas_score: number;
  erps_score: number;
  probability: number;
  timestamp: number;
}

export class DecoherenceFilter {
  private pasThreshold: number = 0.91;
  private erpsThreshold: number = 0.25;
  private entropyThreshold: number = 0.04;
  
  shouldCollapse(state: QuantumState): boolean {
    return (
      state.entropy > this.entropyThreshold ||
      state.pas_score < this.pasThreshold ||
      state.erps_metadata.self_reference_score < this.erpsThreshold
    );
  }
  
  filterPaths(paths: SuperpositionPath[]): SuperpositionPath[] {
    return paths.filter(path => 
      path.pas_score >= this.pasThreshold &&
      path.erps_score >= this.erpsThreshold
    );
  }
}

export interface TemporalCorrection {
  id: string;
  target_state: QuantumState;
  correction_vector: Float32Array;
  reason: string;
  timestamp: number;
}

export interface QuantumMetrics {
  coherence_time: number;
  entanglement_strength: number;
  decoherence_rate: number;
  fidelity: number;
  von_neumann_entropy: number;
}