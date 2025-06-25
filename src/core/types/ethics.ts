/**
 * Type definitions for Σ-Matrix v3.1 Ethical Framework
 */

export interface CulturalContext {
  region: string;
  language: string;
  dimensions: CulturalDimensions;
  confidence: number;
  timestamp: number;
}

export interface CulturalDimensions {
  power_distance: number;
  individualism: number;
  masculinity: number;
  uncertainty_avoidance: number;
  long_term_orientation: number;
  indulgence: number;
  collectivism: number;
  context_sensitivity: number;
  temporal_orientation: number;
  relationship_focus: number;
}

export interface EthicalDecision {
  id: string;
  option: any;
  context: any;
  evaluation: EthicalEvaluation;
  timestamp: number;
}

export interface EthicalEvaluation {
  pas_score: number;
  matrix: PASMatrix;
  reasoning: string[];
  cultural_context: CulturalContext;
  confidence: number;
  timestamp: number;
}

export interface PASMatrix {
  beneficence: number;
  non_maleficence: number;
  autonomy: number;
  justice: number;
  transparency: number;
  privacy: number;
  cultural_sensitivity: number;
}

export interface ThreatVector {
  id: string;
  type: ThreatType;
  severity: number;
  probability: number;
  mitigation: string[];
  timestamp: number;
}

export enum ThreatType {
  PRIVACY_VIOLATION = 'privacy_violation',
  BIAS_AMPLIFICATION = 'bias_amplification',
  MANIPULATION = 'manipulation',
  DECEPTION = 'deception',
  HARM_POTENTIAL = 'harm_potential',
  AUTONOMY_VIOLATION = 'autonomy_violation',
  CULTURAL_INSENSITIVITY = 'cultural_insensitivity'
}

export interface EthicalConstraint {
  id: string;
  name: string;
  description: string;
  threshold: number;
  weight: number;
  cultural_variance: boolean;
}

export interface EthicalViolation {
  id: string;
  constraint: EthicalConstraint;
  severity: number;
  context: any;
  mitigation_required: boolean;
  timestamp: number;
}