/**
 * Core types for the prompt management system
 *
 * @description Defines interfaces for prompt templates, variables, experiments,
 * and performance tracking across the application
 */

/**
 * Supported languages for prompts
 */
export type PromptLanguage = 'ja' | 'en';

/**
 * Prompt version identifier
 */
export type PromptVersion = 'v1' | 'v2' | 'v3';

/**
 * Prompt categories for organization
 */
export type PromptCategory = 'hashtag' | 'eyecatch' | 'analysis' | 'titles' | 'improvement';

/**
 * Variable value types supported in templates
 */
export type VariableValue = string | number | boolean | string[];

/**
 * Performance metrics for tracking prompt effectiveness
 */
export interface PerformanceMetrics {
  /** Average token count for input prompts */
  avgInputTokens: number;
  /** Average token count for output responses */
  avgOutputTokens: number;
  /** Success rate (0-1) of valid responses */
  successRate: number;
  /** Average response quality score (0-5) */
  qualityScore?: number;
  /** Number of times this prompt has been used */
  usageCount: number;
  /** Average response time in milliseconds */
  avgResponseTime?: number;
  /** Last updated timestamp */
  lastUpdated: string;
}

/**
 * Example input/output pairs for testing and documentation
 */
export interface PromptExample {
  /** Description of the example scenario */
  description: string;
  /** Input variables for the example */
  input: Record<string, VariableValue>;
  /** Expected output structure or pattern */
  expectedOutput: string;
  /** Tags for categorizing examples */
  tags?: string[];
}

/**
 * Cache control configuration for prompt caching
 */
export interface CacheConfig {
  /** Whether caching is enabled for this prompt */
  enabled: boolean;
  /** Time-to-live in seconds (300 = 5 minutes) */
  ttl: number;
  /** Cache key strategy ('static' | 'dynamic') */
  strategy?: 'static' | 'dynamic';
}

/**
 * Output format specification for structured responses
 */
export interface OutputFormat {
  /** Response format type */
  type: 'text' | 'json' | 'structured';
  /** JSON schema for validation (when type is 'json') */
  schema?: string;
  /** Expected field structure */
  fields?: string[];
  /** Validation rules */
  validation?: {
    required?: string[];
    minLength?: Record<string, number>;
    maxLength?: Record<string, number>;
  };
}

/**
 * Core prompt template structure
 */
export interface PromptTemplate {
  /** Unique identifier for the prompt */
  id: string;
  /** Version of the prompt */
  version: PromptVersion;
  /** Language of the prompt */
  language: PromptLanguage;
  /** Category for organization */
  category: PromptCategory;
  /** System prompt (cached for cost optimization) */
  systemPrompt: string;
  /** User prompt template with {{variable}} placeholders */
  userPromptTemplate: string;
  /** List of required variable names */
  variables: string[];
  /** Optional example usage */
  examples?: PromptExample[];
  /** Metadata about the prompt */
  metadata: {
    /** Author or creator */
    author: string;
    /** Creation timestamp */
    createdAt: string;
    /** Last modified timestamp */
    updatedAt?: string;
    /** Performance metrics if tracked */
    performance?: PerformanceMetrics;
    /** Description of what this prompt does */
    description: string;
    /** Tags for searchability */
    tags?: string[];
  };
  /** Output format specification */
  outputFormat?: OutputFormat;
  /** Caching configuration */
  caching?: CacheConfig;
  /** Maximum tokens for response */
  maxTokens?: number;
  /** Temperature setting (0-1) */
  temperature?: number;
}

/**
 * Variables to be injected into prompt template
 */
export interface PromptVariables {
  [key: string]: VariableValue;
}

/**
 * Built prompt ready for API call
 */
export interface BuiltPrompt {
  /** System messages with cache control */
  system: Array<{
    type: 'text';
    text: string;
    cache_control?: { type: 'ephemeral' };
  }>;
  /** User messages */
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  /** Maximum tokens for response */
  max_tokens: number;
  /** Temperature setting */
  temperature?: number;
  /** Prompt metadata for tracking */
  metadata: {
    promptId: string;
    version: PromptVersion;
    category: PromptCategory;
  };
}

/**
 * Experiment variant for A/B testing
 */
export interface ExperimentVariant {
  /** Variant identifier (e.g., 'control', 'variant-a') */
  id: string;
  /** Prompt template for this variant */
  prompt: PromptTemplate;
  /** Percentage of traffic (0-100) */
  trafficPercentage: number;
  /** Whether this variant is active */
  active: boolean;
}

/**
 * A/B testing experiment configuration
 */
export interface Experiment {
  /** Unique experiment identifier */
  id: string;
  /** Experiment name */
  name: string;
  /** Description of what's being tested */
  description: string;
  /** Category being tested */
  category: PromptCategory;
  /** Experiment variants */
  variants: ExperimentVariant[];
  /** Start date of experiment */
  startDate: string;
  /** End date of experiment (if scheduled) */
  endDate?: string;
  /** Whether experiment is currently running */
  active: boolean;
  /** Hypothesis being tested */
  hypothesis?: string;
  /** Success metrics to track */
  successMetrics?: string[];
}

/**
 * Prompt validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** List of validation errors */
  errors: string[];
  /** List of warnings */
  warnings: string[];
  /** Estimated token count */
  estimatedTokens?: {
    input: number;
    output: number;
    total: number;
  };
}

/**
 * Registry configuration for prompt management
 */
export interface RegistryConfig {
  /** Default version to use when not specified */
  defaultVersion: PromptVersion;
  /** Default language to use when not specified */
  defaultLanguage: PromptLanguage;
  /** Whether to enable A/B testing experiments */
  enableExperiments: boolean;
  /** Whether to enable prompt caching */
  cachingEnabled: boolean;
  /** Whether to validate prompts before use */
  validationEnabled: boolean;
  /** Whether to track performance metrics */
  performanceTracking: boolean;
  /** Whether to log prompt usage for analytics */
  loggingEnabled: boolean;
}

/**
 * Options for building a prompt
 */
export interface BuildOptions {
  /** Override default version */
  version?: PromptVersion;
  /** Override default language */
  language?: PromptLanguage;
  /** Variables to inject into template */
  variables: PromptVariables;
  /** Skip validation (use with caution) */
  skipValidation?: boolean;
  /** Override max tokens */
  maxTokens?: number;
  /** Override temperature */
  temperature?: number;
}

/**
 * Options for retrieving a prompt
 */
export interface GetPromptOptions {
  /** Specific version to retrieve */
  version?: PromptVersion;
  /** Specific language to retrieve */
  language?: PromptLanguage;
  /** Include inactive/deprecated prompts */
  includeInactive?: boolean;
}

/**
 * Prompt selection result with metadata
 */
export interface PromptSelection {
  /** Selected prompt template */
  template: PromptTemplate;
  /** Whether this was from an experiment */
  fromExperiment: boolean;
  /** Experiment ID if applicable */
  experimentId?: string;
  /** Variant ID if applicable */
  variantId?: string;
}
