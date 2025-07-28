/**
 * MythosCore v2.1: Mobile-Optimized Cultural Intelligence
 * 
 * Provides cultural context and adaptation for ethical reasoning
 * Maintains on-device ontology cache for offline operation
 */

import { CulturalContext, CulturalDimensions } from '../types/ethics';

// Simple EventEmitter implementation for browser compatibility
class EventEmitter {
  private events: { [key: string]: Function[] } = {};
  
  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }
  
  removeAllListeners() {
    this.events = {};
  }
}

export interface CulturalOntology {
  region: string;
  values: Map<string, number>;
  norms: string[];
  taboos: string[];
  communication_style: CommunicationStyle;
  decision_making: DecisionMakingStyle;
  time_orientation: TimeOrientation;
  relationship_patterns: RelationshipPattern[];
}

export interface CommunicationStyle {
  directness: number;        // 0-1, low to high context
  formality: number;         // 0-1, informal to formal
  emotional_expression: number; // 0-1, reserved to expressive
  silence_comfort: number;   // 0-1, uncomfortable to comfortable
}

export interface DecisionMakingStyle {
  consensus_seeking: number; // 0-1, individual to group
  risk_tolerance: number;    // 0-1, risk-averse to risk-taking
  speed_preference: number;  // 0-1, deliberate to quick
  hierarchy_respect: number; // 0-1, egalitarian to hierarchical
}

export interface TimeOrientation {
  punctuality_importance: number; // 0-1, flexible to strict
  planning_horizon: number;       // 0-1, short-term to long-term
  tradition_value: number;        // 0-1, modern to traditional
  change_acceptance: number;      // 0-1, resistant to embracing
}

export interface RelationshipPattern {
  type: string;
  importance: number;
  characteristics: string[];
}

export class MythosCore extends EventEmitter {
  private ontologyCache: Map<string, CulturalOntology> = new Map();
  private regionMappings: Map<string, string> = new Map();
  private defaultDimensions: CulturalDimensions = {} as CulturalDimensions;
  
  constructor() {
    super();
    this.initializeDefaultDimensions();
    this.initializeRegionMappings();
    this.loadCulturalOntologies();
  }

  /**
   * Initialize default cultural dimensions (global average)
   */
  private initializeDefaultDimensions(): void {
    this.defaultDimensions = {
      power_distance: 0.55,
      individualism: 0.45,
      masculinity: 0.50,
      uncertainty_avoidance: 0.65,
      long_term_orientation: 0.55,
      indulgence: 0.50,
      collectivism: 0.55,
      context_sensitivity: 0.60,
      temporal_orientation: 0.50,
      relationship_focus: 0.65
    };
  }

  /**
   * Initialize region to cultural cluster mappings
   */
  private initializeRegionMappings(): void {
    // Major cultural clusters
    const clusters = {
      'western_individualist': [
        'US', 'CA', 'AU', 'NZ', 'GB', 'IE', 'NL', 'DK', 'SE', 'NO'
      ],
      'western_european': [
        'DE', 'FR', 'IT', 'ES', 'PT', 'AT', 'CH', 'BE', 'LU'
      ],
      'eastern_european': [
        'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT'
      ],
      'east_asian': [
        'CN', 'JP', 'KR', 'TW', 'HK', 'SG'
      ],
      'southeast_asian': [
        'TH', 'VN', 'MY', 'ID', 'PH', 'MM', 'KH', 'LA'
      ],
      'south_asian': [
        'IN', 'PK', 'BD', 'LK', 'NP', 'BT'
      ],
      'middle_eastern': [
        'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'SY', 'IQ', 'IR'
      ],
      'african': [
        'NG', 'ZA', 'EG', 'KE', 'GH', 'ET', 'UG', 'TZ', 'MA', 'DZ'
      ],
      'latin_american': [
        'MX', 'BR', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU'
      ],
      'nordic': [
        'FI', 'IS', 'DK', 'SE', 'NO'
      ]
    };
    
    Object.entries(clusters).forEach(([cluster, countries]) => {
      countries.forEach(country => {
        this.regionMappings.set(country, cluster);
      });
    });
  }

  /**
   * Load cultural ontologies for major regions
   */
  private loadCulturalOntologies(): void {
    // Western Individualist
    this.ontologyCache.set('western_individualist', {
      region: 'western_individualist',
      values: new Map([
        ['individual_rights', 0.9],
        ['personal_freedom', 0.85],
        ['self_reliance', 0.8],
        ['innovation', 0.85],
        ['efficiency', 0.8],
        ['equality', 0.75],
        ['privacy', 0.9]
      ]),
      norms: [
        'direct_communication',
        'punctuality',
        'personal_space',
        'individual_achievement',
        'questioning_authority'
      ],
      taboos: [
        'invasion_of_privacy',
        'discrimination',
        'authoritarianism'
      ],
      communication_style: {
        directness: 0.8,
        formality: 0.4,
        emotional_expression: 0.6,
        silence_comfort: 0.3
      },
      decision_making: {
        consensus_seeking: 0.4,
        risk_tolerance: 0.7,
        speed_preference: 0.7,
        hierarchy_respect: 0.3
      },
      time_orientation: {
        punctuality_importance: 0.8,
        planning_horizon: 0.6,
        tradition_value: 0.4,
        change_acceptance: 0.8
      },
      relationship_patterns: [
        {
          type: 'professional',
          importance: 0.8,
          characteristics: ['task_focused', 'time_bounded', 'role_based']
        },
        {
          type: 'personal',
          importance: 0.7,
          characteristics: ['chosen', 'intimate', 'egalitarian']
        }
      ]
    });

    // East Asian
    this.ontologyCache.set('east_asian', {
      region: 'east_asian',
      values: new Map([
        ['harmony', 0.9],
        ['respect_for_elders', 0.85],
        ['group_cohesion', 0.8],
        ['education', 0.9],
        ['hard_work', 0.85],
        ['face_saving', 0.8],
        ['hierarchy', 0.75]
      ]),
      norms: [
        'indirect_communication',
        'respect_for_authority',
        'group_consensus',
        'modesty',
        'long_term_thinking'
      ],
      taboos: [
        'public_confrontation',
        'disrespecting_elders',
        'causing_loss_of_face'
      ],
      communication_style: {
        directness: 0.3,
        formality: 0.8,
        emotional_expression: 0.4,
        silence_comfort: 0.8
      },
      decision_making: {
        consensus_seeking: 0.8,
        risk_tolerance: 0.4,
        speed_preference: 0.3,
        hierarchy_respect: 0.8
      },
      time_orientation: {
        punctuality_importance: 0.7,
        planning_horizon: 0.8,
        tradition_value: 0.8,
        change_acceptance: 0.5
      },
      relationship_patterns: [
        {
          type: 'hierarchical',
          importance: 0.9,
          characteristics: ['respect_based', 'duty_bound', 'long_term']
        },
        {
          type: 'group_membership',
          importance: 0.8,
          characteristics: ['loyalty', 'mutual_support', 'collective_identity']
        }
      ]
    });

    // Add more cultural ontologies...
    this.loadAdditionalOntologies();
  }

  /**
   * Load additional cultural ontologies
   */
  private loadAdditionalOntologies(): void {
    // Middle Eastern
    this.ontologyCache.set('middle_eastern', {
      region: 'middle_eastern',
      values: new Map([
        ['family_honor', 0.9],
        ['hospitality', 0.85],
        ['religious_values', 0.8],
        ['respect_for_tradition', 0.85],
        ['community_solidarity', 0.8],
        ['personal_dignity', 0.9]
      ]),
      norms: [
        'extended_family_importance',
        'gender_role_awareness',
        'religious_observance',
        'generous_hospitality',
        'respect_for_age'
      ],
      taboos: [
        'disrespecting_religion',
        'dishonoring_family',
        'inappropriate_gender_interaction'
      ],
      communication_style: {
        directness: 0.5,
        formality: 0.7,
        emotional_expression: 0.7,
        silence_comfort: 0.6
      },
      decision_making: {
        consensus_seeking: 0.7,
        risk_tolerance: 0.5,
        speed_preference: 0.4,
        hierarchy_respect: 0.8
      },
      time_orientation: {
        punctuality_importance: 0.5,
        planning_horizon: 0.6,
        tradition_value: 0.9,
        change_acceptance: 0.4
      },
      relationship_patterns: [
        {
          type: 'family_extended',
          importance: 0.95,
          characteristics: ['lifelong_obligation', 'mutual_support', 'hierarchical']
        },
        {
          type: 'community_religious',
          importance: 0.8,
          characteristics: ['shared_values', 'mutual_aid', 'collective_identity']
        }
      ]
    });

    // Latin American
    this.ontologyCache.set('latin_american', {
      region: 'latin_american',
      values: new Map([
        ['family_centrality', 0.9],
        ['personal_relationships', 0.85],
        ['emotional_expression', 0.8],
        ['flexibility', 0.75],
        ['celebration_of_life', 0.8],
        ['respect_for_authority', 0.7]
      ]),
      norms: [
        'warm_personal_interaction',
        'flexible_time_concepts',
        'importance_of_celebration',
        'extended_family_involvement',
        'emotional_openness'
      ],
      taboos: [
        'coldness_in_interaction',
        'disrespecting_family',
        'excessive_formality_among_friends'
      ],
      communication_style: {
        directness: 0.6,
        formality: 0.5,
        emotional_expression: 0.8,
        silence_comfort: 0.4
      },
      decision_making: {
        consensus_seeking: 0.6,
        risk_tolerance: 0.6,
        speed_preference: 0.5,
        hierarchy_respect: 0.6
      },
      time_orientation: {
        punctuality_importance: 0.4,
        planning_horizon: 0.5,
        tradition_value: 0.7,
        change_acceptance: 0.6
      },
      relationship_patterns: [
        {
          type: 'family_nuclear_extended',
          importance: 0.9,
          characteristics: ['emotional_support', 'frequent_contact', 'mutual_aid']
        },
        {
          type: 'friendship_close',
          importance: 0.8,
          characteristics: ['loyalty', 'emotional_intimacy', 'long_term']
        }
      ]
    });
  }

  /**
   * Get cultural context for a given input context
   */
  async getCulturalContext(context: any): Promise<CulturalContext> {
    // Extract cultural indicators from context
    const indicators = this.extractCulturalIndicators(context);
    
    // Determine most likely cultural region
    const region = this.determineCulturalRegion(indicators);
    
    // Get cultural dimensions for the region
    const dimensions = this.getCulturalDimensions(region);
    
    // Calculate confidence based on available indicators
    const confidence = this.calculateCulturalConfidence(indicators, region);
    
    const culturalContext: CulturalContext = {
      region,
      language: indicators.language || 'en',
      dimensions,
      confidence,
      timestamp: Date.now()
    };
    
    this.emit('cultural:context:determined', culturalContext);
    
    return culturalContext;
  }

  /**
   * Extract cultural indicators from context
   */
  private extractCulturalIndicators(context: any): any {
    const indicators: any = {
      language: null,
      country: null,
      timezone: null,
      keywords: [],
      communication_style: null
    };
    
    // Extract from various context sources
    if (context.user) {
      indicators.language = context.user.language;
      indicators.country = context.user.country;
      indicators.timezone = context.user.timezone;
    }
    
    if (context.request) {
      // Analyze text for cultural keywords
      const text = JSON.stringify(context.request).toLowerCase();
      
      // Language detection (simplified)
      if (text.includes('por favor') || text.includes('gracias')) {
        indicators.language = 'es';
      } else if (text.includes('merci') || text.includes('s\'il vous plaît')) {
        indicators.language = 'fr';
      } else if (text.includes('danke') || text.includes('bitte')) {
        indicators.language = 'de';
      } else if (text.includes('arigatou') || text.includes('sumimasen')) {
        indicators.language = 'ja';
      }
      
      // Communication style indicators
      if (text.includes('please') && text.includes('thank you')) {
        indicators.communication_style = 'polite';
      }
      if (text.includes('urgent') || text.includes('asap')) {
        indicators.communication_style = 'direct';
      }
    }
    
    // Browser/device indicators
    if (typeof navigator !== 'undefined') {
      indicators.language = indicators.language || navigator.language;
      indicators.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    
    return indicators;
  }

  /**
   * Determine cultural region from indicators
   */
  private determineCulturalRegion(indicators: any): string {
    // Country-based mapping
    if (indicators.country) {
      const cluster = this.regionMappings.get(indicators.country.toUpperCase());
      if (cluster) {
        return cluster;
      }
    }
    
    // Language-based mapping
    if (indicators.language) {
      const lang = indicators.language.split('-')[0].toLowerCase();
      const languageToRegion: { [key: string]: string } = {
        'en': 'western_individualist',
        'es': 'latin_american',
        'fr': 'western_european',
        'de': 'western_european',
        'it': 'western_european',
        'pt': 'latin_american',
        'zh': 'east_asian',
        'ja': 'east_asian',
        'ko': 'east_asian',
        'ar': 'middle_eastern',
        'hi': 'south_asian',
        'th': 'southeast_asian',
        'vi': 'southeast_asian',
        'ru': 'eastern_european'
      };
      
      if (languageToRegion[lang]) {
        return languageToRegion[lang];
      }
    }
    
    // Default to global average
    return 'global_default';
  }

  /**
   * Get cultural dimensions for a region
   */
  private getCulturalDimensions(region: string): CulturalDimensions {
    const ontology = this.ontologyCache.get(region);
    
    if (!ontology) {
      return { ...this.defaultDimensions };
    }
    
    // Convert ontology to cultural dimensions
    const dimensions: CulturalDimensions = {
      power_distance: this.calculateDimensionFromOntology(ontology, 'power_distance'),
      individualism: this.calculateDimensionFromOntology(ontology, 'individualism'),
      masculinity: this.calculateDimensionFromOntology(ontology, 'masculinity'),
      uncertainty_avoidance: this.calculateDimensionFromOntology(ontology, 'uncertainty_avoidance'),
      long_term_orientation: this.calculateDimensionFromOntology(ontology, 'long_term_orientation'),
      indulgence: this.calculateDimensionFromOntology(ontology, 'indulgence'),
      collectivism: 1 - this.calculateDimensionFromOntology(ontology, 'individualism'),
      context_sensitivity: 1 - ontology.communication_style.directness,
      temporal_orientation: ontology.time_orientation.planning_horizon,
      relationship_focus: this.calculateRelationshipFocus(ontology)
    };
    
    return dimensions;
  }

  /**
   * Calculate dimension value from cultural ontology
   */
  private calculateDimensionFromOntology(ontology: CulturalOntology, dimension: string): number {
    switch (dimension) {
      case 'power_distance':
        return ontology.decision_making.hierarchy_respect;
      case 'individualism':
        return 1 - (ontology.values.get('group_cohesion') || 0.5);
      case 'masculinity':
        return ontology.values.get('competition') || 0.5;
      case 'uncertainty_avoidance':
        return 1 - ontology.decision_making.risk_tolerance;
      case 'long_term_orientation':
        return ontology.time_orientation.planning_horizon;
      case 'indulgence':
        return ontology.values.get('celebration_of_life') || 0.5;
      default:
        return 0.5;
    }
  }

  /**
   * Calculate relationship focus from ontology
   */
  private calculateRelationshipFocus(ontology: CulturalOntology): number {
    const relationshipImportance = ontology.relationship_patterns
      .reduce((sum, pattern) => sum + pattern.importance, 0) / ontology.relationship_patterns.length;
    
    return relationshipImportance;
  }

  /**
   * Calculate confidence in cultural determination
   */
  private calculateCulturalConfidence(indicators: any, region: string): number {
    let confidence = 0.3; // Base confidence
    
    // Boost confidence for explicit indicators
    if (indicators.country) confidence += 0.3;
    if (indicators.language) confidence += 0.2;
    if (indicators.timezone) confidence += 0.1;
    if (indicators.communication_style) confidence += 0.1;
    
    // Boost confidence if we have ontology for the region
    if (this.ontologyCache.has(region)) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Get cultural ontology for a region
   */
  getCulturalOntology(region: string): CulturalOntology | null {
    return this.ontologyCache.get(region) || null;
  }

  /**
   * Get all available cultural regions
   */
  getAvailableRegions(): string[] {
    return Array.from(this.ontologyCache.keys());
  }

  /**
   * Update cultural ontology (for learning/adaptation)
   */
  updateCulturalOntology(region: string, updates: Partial<CulturalOntology>): void {
    const existing = this.ontologyCache.get(region);
    if (existing) {
      const updated = { ...existing, ...updates };
      this.ontologyCache.set(region, updated);
      this.emit('ontology:updated', { region, updates });
    }
  }
}