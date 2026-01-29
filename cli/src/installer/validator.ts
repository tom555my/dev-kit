/**
 * Skill Validator
 *
 * Validates skill structure and content before installation.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { Skill, ValidationResult, ValidationError } from '../types/index.js';
import { getLogger, Logger } from '../core/logger.js';

/**
 * Required files for a valid skill
 */
const REQUIRED_FILES = ['SKILL.md'];

/**
 * Skill validation options
 */
export interface ValidationOptions {
  /** Check for naming conflicts */
  checkConflicts?: boolean;
  /** Target directory to check for conflicts */
  targetDir?: string;
}

/**
 * Skill Validator class
 */
export class SkillValidator {
  private logger: Logger;

  constructor() {
    this.logger = getLogger().child('validator');
  }

  /**
   * Validate a skill
   *
   * @param skill - Skill to validate
   * @param options - Validation options
   * @returns Validation result
   */
  async validate(skill: Skill, options: ValidationOptions = {}): Promise<ValidationResult> {
    this.logger.debug(`Validating skill: ${skill.name}`);

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check required files
    await this.validateRequiredFiles(skill, errors, warnings);

    // Validate frontmatter
    await this.validateFrontmatter(skill, errors, warnings);

    // Check for naming conflicts
    if (options.checkConflicts && options.targetDir) {
      await this.validateNoConflicts(skill, options.targetDir, errors, warnings);
    }

    const isValid = errors.length === 0;

    if (isValid) {
      this.logger.debug(`Skill "${skill.name}" is valid`);
    } else {
      this.logger.warn(`Skill "${skill.name}" has ${errors.length} validation errors`);
    }

    return {
      errors,
      warnings,
      isValid: () => isValid,
    };
  }

  /**
   * Validate required files exist
   */
  private async validateRequiredFiles(
    skill: Skill,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): Promise<void> {
    for (const requiredFile of REQUIRED_FILES) {
      const filePath = path.join(skill.sourcePath, requiredFile);

      try {
        await fs.access(filePath);
      } catch {
        errors.push({
          field: 'files',
          issue: `Missing required file: ${requiredFile}`,
          severity: 'error',
        });
      }
    }

    // Check if additional required files are specified
    for (const file of skill.requiredFiles) {
      const filePath = path.join(skill.sourcePath, file);

      try {
        const stats = await fs.stat(filePath);
        if (!stats.isFile() && !stats.isDirectory()) {
          warnings.push({
            field: 'files',
            issue: `Required path exists but is not a file or directory: ${file}`,
            severity: 'warning',
          });
        }
      } catch {
        errors.push({
          field: 'files',
          issue: `Missing required file/directory: ${file}`,
          severity: 'error',
        });
      }
    }
  }

  /**
   * Validate YAML frontmatter in SKILL.md
   */
  private async validateFrontmatter(
    skill: Skill,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): Promise<void> {
    const skillPath = path.join(skill.sourcePath, 'SKILL.md');

    try {
      const content = await fs.readFile(skillPath, 'utf-8');

      // Check for frontmatter delimiters
      if (!content.startsWith('---')) {
        errors.push({
          field: 'frontmatter',
          issue: 'SKILL.md must start with YAML frontmatter (---)',
          severity: 'error',
        });
        return;
      }

      // Extract frontmatter
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd === -1) {
        errors.push({
          field: 'frontmatter',
          issue: 'SKILL.md frontmatter must end with ---',
          severity: 'error',
        });
        return;
      }

      const frontmatter = content.slice(3, frontmatterEnd).trim();

      // Check for required fields
      if (!frontmatter.includes('name:') && !frontmatter.includes('description:')) {
        warnings.push({
          field: 'frontmatter',
          issue: 'Frontmatter should include at least "name" or "description" field',
          severity: 'warning',
        });
      }

      // Validate common fields
      const fields = this.parseFrontmatter(frontmatter);

      if (fields['user-invocable'] === false) {
        this.logger.debug(`Skill "${skill.name}" is marked as not user-invocable`);
      }

    } catch (error) {
      errors.push({
        field: 'frontmatter',
        issue: `Failed to read SKILL.md: ${(error as Error).message}`,
        severity: 'error',
      });
    }
  }

  /**
   * Parse YAML frontmatter (simple implementation)
   *
   * Note: This is a simple parser that extracts key-value pairs.
   * For production, consider using a proper YAML parser.
   */
  private parseFrontmatter(frontmatter: string): Record<string, string | boolean> {
    const fields: Record<string, string | boolean> = {};

    for (const line of frontmatter.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();

      // Handle boolean values
      if (value === 'true') {
        fields[key] = true;
      } else if (value === 'false') {
        fields[key] = false;
      } else {
        // Remove quotes if present
        fields[key] = value.replace(/^['"]|['"]$/g, '');
      }
    }

    return fields;
  }

  /**
   * Check for naming conflicts with existing skills
   */
  private async validateNoConflicts(
    skill: Skill,
    targetDir: string,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): Promise<void> {
    const targetPath = path.join(targetDir, skill.name);

    try {
      await fs.access(targetPath);

      // Skill exists - check if it's a conflict or an update
      const existingSkillPath = path.join(targetPath, 'SKILL.md');

      try {
        await fs.access(existingSkillPath);
        warnings.push({
          field: 'naming',
          issue: `Skill "${skill.name}" already exists in target directory`,
          severity: 'warning',
        });
      } catch {
        // Path exists but no SKILL.md - might be a conflict
        errors.push({
          field: 'naming',
          issue: `Path "${skill.name}" already exists but is not a valid skill`,
          severity: 'error',
        });
      }
    } catch {
      // Path doesn't exist - no conflict
      this.logger.debug(`No naming conflict for skill "${skill.name}"`);
    }
  }

  /**
   * Validate skill at a specific path
   *
   * @param skillPath - Path to skill directory
   * @returns Validation result
   */
  async validateSkillAtPath(skillPath: string): Promise<ValidationResult> {
    const skillName = path.basename(skillPath);

    const skill: Skill = {
      name: skillName,
      sourcePath: skillPath,
      targetPath: '',
      requiredFiles: REQUIRED_FILES,
      compatibleAgents: ['claude-code', 'github-copilot'],
      frontmatter: {},
    };

    return this.validate(skill, {
      checkConflicts: false,
    });
  }
}

/**
 * Validate a skill
 *
 * Convenience function for quick validation
 */
export async function validateSkill(
  skill: Skill,
  options?: ValidationOptions
): Promise<ValidationResult> {
  const validator = new SkillValidator();
  return validator.validate(skill, options);
}
