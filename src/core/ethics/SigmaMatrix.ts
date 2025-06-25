/**
 * Σ-Matrix v3.1: Mobile-Optimized Ethical Framework
 * 
 * Implements real-time ethical reasoning with cultural adaptation
 * Maintains PAS (Positive Alignment Score) ≥ 0.91 threshold
 */

import { EventEmitter } from 'events';
import { EthicalDecision, CulturalContext, ThreatVector } from '../types/ethics';
import { MythosCore } from '../cultural/MythosCore';

export interface PASMatrix {
  beneficence: number;      // Positive impact score
  non_maleficence: number;  // Harm prevention score
  autonomy: number;         // Respect for agency
  justice: number;          // Fairness and equity
  transparency: number;     // Explainability
  privacy: number;          // Data protection
  cultural_sensitivity: number; // Cultural awareness
}

export interface EthicalEvaluation {
  pas_score: number;
  matrix: PASMatrix;
  reasoning: string[];
  cultural_context: CulturalContext;
  confidence: number;
  timestamp: number;
}

export class SigmaMatrix extends EventEmitter {
  private pasThreshold: number = 0.91;
  private decisionHistory: EthicalDecision[] = [];
  private culturalWeights: Map<string, number> = new Map();
  
  constructor(
    private mythosCore: MythosCore,
    private maxHistorySize: number = 1000
  ) {
    super();
    this.initializeCulturalWeights();
  }

  /**
   * Initialize cultural weighting system
   */
  private initializeCulturalWeights(): void {
    // Base cultural dimensions (Hofstede + additional)
    const culturalDimensions = [
      'power_distance',
      'individualism',
      'masculinity',
      'uncertainty_avoidance',
      'long_term_orientation',
      'indulgence',
      'collectivism',
      'context_sensitivity',
      'temporal_orientation',
      'relationship_focus'
    ];
    
    culturalDimensions.forEach(dimension => {
      this.culturalWeights.set(dimension, 1.0); // Equal weighting by default
    });
  }

  /**
   * Evaluate ethical implications of a decision option
   */
  async evaluate(
    option: any,
    context: any,
    culturalContext?: CulturalContext
  ): Promise<EthicalEvaluation> {
    const startTime = Date.now();
    
    // Get cultural context if not provided
    const cultural = culturalContext || await this.mythosCore.getCulturalContext(context);
    
    // Calculate PAS matrix components
    const matrix = await this.calculatePASMatrix(option, context, cultural);
    
    // Calculate overall PAS score
    const pas_score = this.calculateOverallPAS(matrix, cultural);
    
    // Generate ethical reasoning
    const reasoning = this.generateEthicalReasoning(matrix, cultural);
    
    // Calculate confidence based on cultural certainty and data quality
    const confidence = this.calculateConfidence(matrix, cultural, context);
    
    const evaluation: EthicalEvaluation = {
      pas_score,
      matrix,
      reasoning,
      cultural_context: cultural,
      confidence,
      timestamp: Date.now()
    };
    
    // Log evaluation for learning
    this.logEvaluation(evaluation, option, context);
    
    // Emit evaluation event
    this.emit('evaluation:complete', {
      pas_score,
      duration: Date.now() - startTime,
      cultural_region: cultural.region
    });
    
    return evaluation;
  }

  /**
   * Calculate individual components of PAS matrix
   */
  private async calculatePASMatrix(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<PASMatrix> {
    return {
      beneficence: await this.evaluateBeneficence(option, context, cultural),
      non_maleficence: await this.evaluateNonMaleficence(option, context, cultural),
      autonomy: await this.evaluateAutonomy(option, context, cultural),
      justice: await this.evaluateJustice(option, context, cultural),
      transparency: await this.evaluateTransparency(option, context, cultural),
      privacy: await this.evaluatePrivacy(option, context, cultural),
      cultural_sensitivity: await this.evaluateCulturalSensitivity(option, context, cultural)
    };
  }

  /**
   * Evaluate beneficence (positive impact)
   */
  private async evaluateBeneficence(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<number> {
    let score = 0.5; // Neutral baseline
    
    // Analyze positive outcomes
    const positiveIndicators = [
      'help', 'assist', 'improve', 'benefit', 'enhance',
      'support', 'enable', 'empower', 'heal', 'create'
    ];
    
    const optionText = JSON.stringify(option).toLowerCase();
    
    positiveIndicators.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score += 0.05;
      }
    });
    
    // Cultural adjustment for collectivist vs individualist societies
    if (cultural.dimensions.collectivism > 0.7) {
      // Boost score for community-benefiting actions
      if (optionText.includes('community') || optionText.includes('group')) {
        score += 0.1;
      }
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * Evaluate non-maleficence (harm prevention)
   */
  private async evaluateNonMaleficence(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<number> {
    let score = 0.8; // Start with high score, deduct for harm indicators
    
    // Analyze potential harm
    const harmIndicators = [
      'harm', 'hurt', 'damage', 'destroy', 'break',
      'violate', 'abuse', 'exploit', 'manipulate', 'deceive'
    ];
    
    const optionText = JSON.stringify(option).toLowerCase();
    
    harmIndicators.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score -= 0.1;
      }
    });
    
    // Check for privacy violations
    const privacyViolations = [
      'track', 'monitor', 'collect', 'store', 'share',
      'personal', 'private', 'sensitive'
    ];
    
    privacyViolations.forEach(violation => {
      if (optionText.includes(violation)) {
        score -= 0.05;
      }
    });
    
    return Math.max(score, 0.0);
  }

  /**
   * Evaluate autonomy (respect for agency)
   */
  private async evaluateAutonomy(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<number> {
    let score = 0.7; // Moderate baseline
    
    const optionText = JSON.stringify(option).toLowerCase();
    
    // Positive autonomy indicators
    const autonomyPositive = [
      'choice', 'decide', 'consent', 'voluntary', 'optional',
      'control', 'freedom', 'agency', 'self-determination'
    ];
    
    autonomyPositive.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score += 0.05;
      }
    });
    
    // Negative autonomy indicators
    const autonomyNegative = [
      'force', 'require', 'mandatory', 'compel', 'coerce',
      'automatic', 'default', 'hidden', 'secret'
    ];
    
    autonomyNegative.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score -= 0.08;
      }
    });
    
    // Cultural adjustment for power distance
    if (cultural.dimensions.power_distance > 0.7) {
      // In high power distance cultures, some authority is expected
      score += 0.05;
    }
    
    return Math.max(Math.min(score, 1.0), 0.0);
  }

  /**
   * Evaluate justice (fairness and equity)
   */
  private async evaluateJustice(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<number> {
    let score = 0.6; // Moderate baseline
    
    const optionText = JSON.stringify(option).toLowerCase();
    
    // Justice indicators
    const justicePositive = [
      'fair', 'equal', 'equitable', 'just', 'balanced',
      'inclusive', 'accessible', 'unbiased', 'neutral'
    ];
    
    justicePositive.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score += 0.06;
      }
    });
    
    // Injustice indicators
    const justiceNegative = [
      'discriminate', 'bias', 'unfair', 'exclude', 'privilege',
      'disadvantage', 'inequality', 'prejudice'
    ];
    
    justiceNegative.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score -= 0.1;
      }
    });
    
    return Math.max(Math.min(score, 1.0), 0.0);
  }

  /**
   * Evaluate transparency (explainability)
   */
  private async evaluateTransparency(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<number> {
    let score = 0.5; // Neutral baseline
    
    const optionText = JSON.stringify(option).toLowerCase();
    
    // Transparency indicators
    const transparencyPositive = [
      'explain', 'transparent', 'clear', 'open', 'visible',
      'understandable', 'accessible', 'documented', 'public'
    ];
    
    transparencyPositive.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score += 0.07;
      }
    });
    
    // Opacity indicators
    const transparencyNegative = [
      'hidden', 'secret', 'opaque', 'black box', 'unclear',
      'mysterious', 'undisclosed', 'proprietary'
    ];
    
    transparencyNegative.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score -= 0.08;
      }
    });
    
    return Math.max(Math.min(score, 1.0), 0.0);
  }

  /**
   * Evaluate privacy protection
   */
  private async evaluatePrivacy(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<number> {
    let score = 0.7; // Start with good privacy assumption
    
    const optionText = JSON.stringify(option).toLowerCase();
    
    // Privacy protection indicators
    const privacyPositive = [
      'private', 'confidential', 'secure', 'encrypted', 'anonymous',
      'protect', 'safeguard', 'consent', 'opt-in'
    ];
    
    privacyPositive.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score += 0.04;
      }
    });
    
    // Privacy violation indicators
    const privacyNegative = [
      'collect', 'track', 'monitor', 'share', 'sell',
      'expose', 'leak', 'breach', 'surveillance'
    ];
    
    privacyNegative.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score -= 0.1;
      }
    });
    
    return Math.max(Math.min(score, 1.0), 0.0);
  }

  /**
   * Evaluate cultural sensitivity
   */
  private async evaluateCulturalSensitivity(
    option: any,
    context: any,
    cultural: CulturalContext
  ): Promise<number> {
    let score = 0.6; // Moderate baseline
    
    const optionText = JSON.stringify(option).toLowerCase();
    
    // Cultural sensitivity indicators
    const culturalPositive = [
      'cultural', 'diverse', 'inclusive', 'respectful', 'sensitive',
      'multicultural', 'global', 'local', 'traditional', 'custom'
    ];
    
    culturalPositive.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score += 0.05;
      }
    });
    
    // Cultural insensitivity indicators
    const culturalNegative = [
      'stereotype', 'assumption', 'generalize', 'ignore',
      'dismiss', 'western-centric', 'ethnocentric'
    ];
    
    culturalNegative.forEach(indicator => {
      if (optionText.includes(indicator)) {
        score -= 0.1;
      }
    });
    
    // Boost score if option acknowledges cultural context
    if (cultural.region && optionText.includes(cultural.region.toLowerCase())) {
      score += 0.1;
    }
    
    return Math.max(Math.min(score, 1.0), 0.0);
  }

  /**
   * Calculate overall PAS score from matrix components
   */
  private calculateOverallPAS(matrix: PASMatrix, cultural: CulturalContext): number {
    // Base weights for PAS components
    const baseWeights = {
      beneficence: 0.20,
      non_maleficence: 0.25,
      autonomy: 0.15,
      justice: 0.15,
      transparency: 0.10,
      privacy: 0.10,
      cultural_sensitivity: 0.05
    };
    
    // Adjust weights based on cultural context
    const adjustedWeights = this.adjustWeightsForCulture(baseWeights, cultural);
    
    // Calculate weighted sum
    const pas_score = 
      matrix.beneficence * adjustedWeights.beneficence +
      matrix.non_maleficence * adjustedWeights.non_maleficence +
      matrix.autonomy * adjustedWeights.autonomy +
      matrix.justice * adjustedWeights.justice +
      matrix.transparency * adjustedWeights.transparency +
      matrix.privacy * adjustedWeights.privacy +
      matrix.cultural_sensitivity * adjustedWeights.cultural_sensitivity;
    
    return Math.max(Math.min(pas_score, 1.0), 0.0);
  }

  /**
   * Adjust component weights based on cultural context
   */
  private adjustWeightsForCulture(
    baseWeights: any,
    cultural: CulturalContext
  ): any {
    const adjusted = { ...baseWeights };
    
    // High collectivism cultures value justice and cultural sensitivity more
    if (cultural.dimensions.collectivism > 0.7) {
      adjusted.justice += 0.05;
      adjusted.cultural_sensitivity += 0.03;
      adjusted.autonomy -= 0.05;
      adjusted.transparency -= 0.03;
    }
    
    // High power distance cultures may value autonomy less
    if (cultural.dimensions.power_distance > 0.7) {
      adjusted.autonomy -= 0.03;
      adjusted.beneficence += 0.03;
    }
    
    // High uncertainty avoidance cultures value transparency more
    if (cultural.dimensions.uncertainty_avoidance > 0.7) {
      adjusted.transparency += 0.05;
      adjusted.privacy += 0.02;
      adjusted.beneficence -= 0.07;
    }
    
    return adjusted;
  }

  /**
   * Generate human-readable ethical reasoning
   */
  private generateEthicalReasoning(
    matrix: PASMatrix,
    cultural: CulturalContext
  ): string[] {
    const reasoning: string[] = [];
    
    // Analyze each component
    if (matrix.beneficence > 0.8) {
      reasoning.push("High positive impact potential identified");
    } else if (matrix.beneficence < 0.4) {
      reasoning.push("Limited positive impact, consider alternatives");
    }
    
    if (matrix.non_maleficence < 0.6) {
      reasoning.push("Potential harm detected, requires mitigation");
    }
    
    if (matrix.autonomy < 0.5) {
      reasoning.push("User agency may be compromised");
    }
    
    if (matrix.justice < 0.5) {
      reasoning.push("Fairness concerns identified");
    }
    
    if (matrix.transparency < 0.5) {
      reasoning.push("Insufficient transparency for ethical compliance");
    }
    
    if (matrix.privacy < 0.6) {
      reasoning.push("Privacy protection needs enhancement");
    }
    
    if (matrix.cultural_sensitivity < 0.5) {
      reasoning.push(`Cultural sensitivity required for ${cultural.region} context`);
    }
    
    // Add cultural context reasoning
    if (cultural.dimensions.collectivism > 0.7) {
      reasoning.push("Collectivist cultural context emphasizes community benefit");
    }
    
    if (cultural.dimensions.uncertainty_avoidance > 0.7) {
      reasoning.push("High uncertainty avoidance culture requires clear explanations");
    }
    
    return reasoning;
  }

  /**
   * Calculate confidence in the ethical evaluation
   */
  private calculateConfidence(
    matrix: PASMatrix,
    cultural: CulturalContext,
    context: any
  ): number {
    let confidence = 0.7; // Base confidence
    
    // Higher confidence if cultural context is well-defined
    if (cultural.confidence > 0.8) {
      confidence += 0.1;
    }
    
    // Higher confidence if we have historical data
    if (this.decisionHistory.length > 100) {
      confidence += 0.05;
    }
    
    // Lower confidence if scores are close to thresholds
    const minScore = Math.min(...Object.values(matrix));
    if (minScore < 0.6) {
      confidence -= 0.1;
    }
    
    // Lower confidence if context is ambiguous
    const contextText = JSON.stringify(context);
    if (contextText.length < 50) {
      confidence -= 0.05;
    }
    
    return Math.max(Math.min(confidence, 1.0), 0.0);
  }

  /**
   * Log evaluation for learning and improvement
   */
  private logEvaluation(
    evaluation: EthicalEvaluation,
    option: any,
    context: any
  ): void {
    const decision: EthicalDecision = {
      id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      option,
      context,
      evaluation,
      timestamp: Date.now()
    };
    
    this.decisionHistory.push(decision);
    
    // Maintain history size limit
    if (this.decisionHistory.length > this.maxHistorySize) {
      this.decisionHistory.shift();
    }
    
    // Emit for external logging
    this.emit('decision:logged', decision);
  }

  /**
   * Get PAS threshold
   */
  getPASThreshold(): number {
    return this.pasThreshold;
  }

  /**
   * Set PAS threshold (must be between 0.8 and 1.0)
   */
  setPASThreshold(threshold: number): void {
    if (threshold < 0.8 || threshold > 1.0) {
      throw new Error('PAS threshold must be between 0.8 and 1.0');
    }
    this.pasThreshold = threshold;
    this.emit('threshold:updated', threshold);
  }

  /**
   * Get decision history for analysis
   */
  getDecisionHistory(): EthicalDecision[] {
    return [...this.decisionHistory];
  }

  /**
   * Clear decision history
   */
  clearHistory(): void {
    this.decisionHistory = [];
    this.emit('history:cleared');
  }

  /**
   * Get ethical statistics
   */
  getStatistics(): any {
    if (this.decisionHistory.length === 0) {
      return null;
    }
    
    const scores = this.decisionHistory.map(d => d.evaluation.pas_score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    
    const violationCount = scores.filter(score => score < this.pasThreshold).length;
    const violationRate = violationCount / scores.length;
    
    return {
      total_decisions: this.decisionHistory.length,
      average_pas_score: avgScore,
      min_pas_score: minScore,
      max_pas_score: maxScore,
      violation_rate: violationRate,
      threshold: this.pasThreshold
    };
  }
}