/**
 * Prompt Builder
 *
 * @description Builds complete prompts from templates by injecting variables,
 * applying caching strategies, and validating the final output
 */

import type {
  PromptTemplate,
  PromptVariables,
  BuiltPrompt,
  ValidationResult,
} from './types';
import { validatePrompt } from './validation/validatePrompt';
import { estimateTokens } from './validation/estimateTokens';

/**
 * PromptBuilder class for constructing prompts from templates
 *
 * @example
 * ```typescript
 * const builder = new PromptBuilder();
 * const prompt = builder.build(template, {
 *   articleText: 'My article content...',
 *   count: 20
 * });
 * ```
 */
export class PromptBuilder {
  private skipValidation: boolean;

  constructor(options?: { skipValidation?: boolean }) {
    this.skipValidation = options?.skipValidation || false;
  }

  /**
   * Build a complete prompt from a template with variable injection
   *
   * @param template - The prompt template to use
   * @param variables - Variables to inject into the template
   * @returns Built prompt ready for API call
   * @throws {Error} If validation fails or required variables are missing
   *
   * @example
   * ```typescript
   * const prompt = builder.build(hashtagTemplate, {
   *   articleText: 'Content about AI...'
   * });
   * ```
   */
  build(template: PromptTemplate, variables: PromptVariables): BuiltPrompt {
    // Validate template and variables
    if (!this.skipValidation) {
      const validation = this.validateBuild(template, variables);
      if (!validation.valid) {
        throw new Error(
          `Prompt validation failed: ${validation.errors.join(', ')}`
        );
      }
    }

    // Inject variables into user prompt template
    const userPrompt = this.injectVariables(
      template.userPromptTemplate,
      variables
    );

    // Build system messages with optional caching
    const systemMessages = [
      {
        type: 'text' as const,
        text: template.systemPrompt,
        ...(template.caching?.enabled
          ? { cache_control: { type: 'ephemeral' as const } }
          : {}),
      },
    ];

    // Build user messages
    const userMessages = [
      {
        role: 'user' as const,
        content: userPrompt,
      },
    ];

    return {
      system: systemMessages,
      messages: userMessages,
      max_tokens: template.maxTokens || 1000,
      temperature: template.temperature,
      metadata: {
        promptId: template.id,
        version: template.version,
        category: template.category,
      },
    };
  }

  /**
   * Inject variables into a template string
   *
   * @description Replaces {{variableName}} placeholders with actual values
   * Supports string, number, boolean, and string array values
   *
   * @param template - Template string with {{variable}} placeholders
   * @param variables - Object containing variable values
   * @returns Template with variables injected
   *
   * @example
   * ```typescript
   * const result = builder.injectVariables(
   *   'Article: {{articleText}}, Count: {{count}}',
   *   { articleText: 'Hello', count: 5 }
   * );
   * // Returns: 'Article: Hello, Count: 5'
   * ```
   */
  injectVariables(template: string, variables: PromptVariables): string {
    let result = template;

    // Replace each variable placeholder
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

      // Convert value to string based on type
      let stringValue: string;
      if (Array.isArray(value)) {
        stringValue = value.join(', ');
      } else if (typeof value === 'boolean') {
        stringValue = value ? 'true' : 'false';
      } else {
        stringValue = String(value);
      }

      result = result.replace(regex, stringValue);
    }

    // Check for remaining placeholders (missing variables)
    const remainingPlaceholders = result.match(/\{\{[^}]+\}\}/g);
    if (remainingPlaceholders && remainingPlaceholders.length > 0) {
      throw new Error(
        `Missing variables in template: ${remainingPlaceholders.join(', ')}`
      );
    }

    return result;
  }

  /**
   * Validate template and variables before building
   *
   * @param template - The prompt template to validate
   * @param variables - Variables to validate
   * @returns Validation result with any errors or warnings
   */
  private validateBuild(
    template: PromptTemplate,
    variables: PromptVariables
  ): ValidationResult {
    // Validate template structure
    const templateValidation = validatePrompt(template);
    if (!templateValidation.valid) {
      return templateValidation;
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check all required variables are provided
    for (const requiredVar of template.variables) {
      if (!(requiredVar in variables)) {
        errors.push(`Missing required variable: ${requiredVar}`);
      }
    }

    // Check for unexpected variables (warning only)
    for (const providedVar of Object.keys(variables)) {
      if (!template.variables.includes(providedVar)) {
        warnings.push(`Unexpected variable: ${providedVar}`);
      }
    }

    // Estimate token usage
    let estimatedTokens;
    try {
      const builtPrompt = this.injectVariables(
        template.userPromptTemplate,
        variables
      );
      estimatedTokens = {
        input: estimateTokens(template.systemPrompt + builtPrompt),
        output: template.maxTokens || 1000,
        total: 0,
      };
      estimatedTokens.total = estimatedTokens.input + estimatedTokens.output;
    } catch (error) {
      // Token estimation is best-effort, don't fail validation
      warnings.push(`Could not estimate tokens: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      estimatedTokens,
    };
  }

  /**
   * Preview what a prompt will look like with variables injected
   *
   * @description Useful for debugging and testing prompts without making API calls
   *
   * @param template - The prompt template
   * @param variables - Variables to inject
   * @returns Object with system and user prompts as strings
   */
  preview(
    template: PromptTemplate,
    variables: PromptVariables
  ): { system: string; user: string; metadata: Record<string, unknown> } {
    const userPrompt = this.injectVariables(
      template.userPromptTemplate,
      variables
    );

    return {
      system: template.systemPrompt,
      user: userPrompt,
      metadata: {
        id: template.id,
        version: template.version,
        category: template.category,
        maxTokens: template.maxTokens,
        temperature: template.temperature,
        cachingEnabled: template.caching?.enabled || false,
        estimatedInputTokens: estimateTokens(
          template.systemPrompt + userPrompt
        ),
        estimatedOutputTokens: template.maxTokens || 1000,
      },
    };
  }

  /**
   * Clone a prompt template with overrides
   *
   * @description Useful for creating variations of existing templates
   *
   * @param template - Base template to clone
   * @param overrides - Properties to override
   * @returns New template with overrides applied
   */
  clone(
    template: PromptTemplate,
    overrides: Partial<PromptTemplate>
  ): PromptTemplate {
    return {
      ...template,
      ...overrides,
      metadata: {
        ...template.metadata,
        ...(overrides.metadata || {}),
      },
    };
  }

  /**
   * Enable or disable validation for this builder
   *
   * @param skip - Whether to skip validation
   */
  setSkipValidation(skip: boolean): void {
    this.skipValidation = skip;
  }
}

/**
 * Create a new prompt builder instance
 *
 * @param options - Builder configuration options
 * @returns New PromptBuilder instance
 *
 * @example
 * ```typescript
 * const builder = createPromptBuilder({ skipValidation: false });
 * ```
 */
export function createPromptBuilder(options?: {
  skipValidation?: boolean;
}): PromptBuilder {
  return new PromptBuilder(options);
}
