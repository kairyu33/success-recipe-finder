/**
 * Prompt Validation
 *
 * @description Validates prompt template structure, required fields,
 * and configuration to catch errors before runtime
 */

import type { PromptTemplate, ValidationResult } from '../types';

/**
 * Validate a prompt template structure
 *
 * @description Checks for:
 * - Required fields presence
 * - Valid enum values
 * - Reasonable token limits
 * - Variable placeholder syntax
 * - Output format consistency
 *
 * @param template - Prompt template to validate
 * @returns Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const result = validatePrompt(template);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validatePrompt(template: PromptTemplate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!template.id || template.id.trim() === '') {
    errors.push('Prompt ID is required');
  }

  if (!template.systemPrompt || template.systemPrompt.trim() === '') {
    errors.push('System prompt is required');
  }

  if (!template.userPromptTemplate || template.userPromptTemplate.trim() === '') {
    errors.push('User prompt template is required');
  }

  if (!template.variables || !Array.isArray(template.variables)) {
    errors.push('Variables array is required');
  }

  if (!template.metadata) {
    errors.push('Metadata is required');
  } else {
    if (!template.metadata.author) {
      warnings.push('Author metadata is missing');
    }
    if (!template.metadata.createdAt) {
      errors.push('CreatedAt metadata is required');
    }
    if (!template.metadata.description) {
      warnings.push('Description metadata is missing');
    }
  }

  // Enum validation
  const validVersions = ['v1', 'v2', 'v3'];
  if (!validVersions.includes(template.version)) {
    errors.push(`Invalid version: ${template.version}`);
  }

  const validLanguages = ['ja', 'en'];
  if (!validLanguages.includes(template.language)) {
    errors.push(`Invalid language: ${template.language}`);
  }

  const validCategories = ['hashtag', 'eyecatch', 'analysis', 'titles'];
  if (!validCategories.includes(template.category)) {
    errors.push(`Invalid category: ${template.category}`);
  }

  // Token limits validation
  if (template.maxTokens !== undefined) {
    if (template.maxTokens < 50) {
      warnings.push('Max tokens is very low (< 50), may truncate responses');
    }
    if (template.maxTokens > 4096) {
      warnings.push('Max tokens is very high (> 4096), may be costly');
    }
  }

  // Temperature validation
  if (template.temperature !== undefined) {
    if (template.temperature < 0 || template.temperature > 1) {
      errors.push('Temperature must be between 0 and 1');
    }
    if (template.temperature > 0.9) {
      warnings.push('High temperature (> 0.9) may produce inconsistent results');
    }
  }

  // Variable placeholder validation
  if (template.variables && template.variables.length > 0) {
    for (const variable of template.variables) {
      const placeholder = `{{${variable}}}`;
      if (!template.userPromptTemplate.includes(placeholder)) {
        warnings.push(
          `Variable "${variable}" declared but not used in template`
        );
      }
    }

    // Check for placeholders not in variables array
    const placeholders = template.userPromptTemplate.match(/\{\{([^}]+)\}\}/g);
    if (placeholders) {
      for (const placeholder of placeholders) {
        const varName = placeholder.slice(2, -2);
        if (!template.variables.includes(varName)) {
          errors.push(
            `Placeholder "${placeholder}" used but not declared in variables array`
          );
        }
      }
    }
  }

  // System prompt placeholders (should not have variables)
  const systemPlaceholders = template.systemPrompt.match(/\{\{([^}]+)\}\}/g);
  if (systemPlaceholders) {
    warnings.push(
      'System prompt contains variable placeholders - these will not be replaced'
    );
  }

  // Caching configuration validation
  if (template.caching) {
    if (template.caching.enabled && !template.caching.ttl) {
      errors.push('Caching TTL is required when caching is enabled');
    }
    if (template.caching.ttl && template.caching.ttl < 60) {
      warnings.push('Caching TTL is very short (< 60s), may not be effective');
    }
    if (template.caching.ttl && template.caching.ttl > 600) {
      warnings.push('Caching TTL is very long (> 10min), may serve stale results');
    }
  }

  // Output format validation
  if (template.outputFormat) {
    const validTypes = ['text', 'json', 'structured'];
    if (!validTypes.includes(template.outputFormat.type)) {
      errors.push(`Invalid output format type: ${template.outputFormat.type}`);
    }

    if (template.outputFormat.type === 'json' && !template.outputFormat.schema) {
      warnings.push('JSON output format should have a schema defined');
    }
  }

  // Examples validation
  if (template.examples && template.examples.length > 0) {
    for (const example of template.examples) {
      if (!example.description) {
        warnings.push('Example missing description');
      }
      if (!example.input) {
        errors.push('Example missing input');
      }
      if (!example.expectedOutput) {
        warnings.push('Example missing expected output');
      }

      // Validate example uses declared variables
      if (example.input && template.variables) {
        const exampleVars = Object.keys(example.input);
        for (const exampleVar of exampleVars) {
          if (!template.variables.includes(exampleVar)) {
            warnings.push(
              `Example uses undeclared variable: ${exampleVar}`
            );
          }
        }
      }
    }
  } else {
    warnings.push('No examples provided - consider adding examples for documentation');
  }

  // Performance metrics validation
  if (template.metadata.performance) {
    const perf = template.metadata.performance;
    if (perf.successRate < 0 || perf.successRate > 1) {
      errors.push('Success rate must be between 0 and 1');
    }
    if (perf.qualityScore !== undefined) {
      if (perf.qualityScore < 0 || perf.qualityScore > 5) {
        errors.push('Quality score must be between 0 and 5');
      }
    }
    if (perf.usageCount < 0) {
      errors.push('Usage count cannot be negative');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate multiple prompts at once
 *
 * @param templates - Array of prompt templates to validate
 * @returns Map of template IDs to validation results
 */
export function validatePrompts(
  templates: PromptTemplate[]
): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>();

  for (const template of templates) {
    results.set(template.id, validatePrompt(template));
  }

  return results;
}

/**
 * Check if a validation result has any issues
 *
 * @param result - Validation result to check
 * @returns True if there are errors or warnings
 */
export function hasIssues(result: ValidationResult): boolean {
  return result.errors.length > 0 || result.warnings.length > 0;
}

/**
 * Format validation result as human-readable string
 *
 * @param result - Validation result to format
 * @returns Formatted string with errors and warnings
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.valid) {
    lines.push('✓ Validation passed');
  } else {
    lines.push('✗ Validation failed');
  }

  if (result.errors.length > 0) {
    lines.push('\nErrors:');
    for (const error of result.errors) {
      lines.push(`  - ${error}`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push('\nWarnings:');
    for (const warning of result.warnings) {
      lines.push(`  - ${warning}`);
    }
  }

  if (result.estimatedTokens) {
    lines.push('\nEstimated tokens:');
    lines.push(`  Input: ${result.estimatedTokens.input}`);
    lines.push(`  Output: ${result.estimatedTokens.output}`);
    lines.push(`  Total: ${result.estimatedTokens.total}`);
  }

  return lines.join('\n');
}
