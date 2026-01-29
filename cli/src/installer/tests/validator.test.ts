/**
 * Skill Validator Tests
 */

import { SkillValidator } from '../validator.js';
import type { Skill } from '../../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { mkdtemp, rmdir } from 'fs/promises';

describe('SkillValidator', () => {
  let validator: SkillValidator;
  let tempDir: string;

  beforeEach(async () => {
    validator = new SkillValidator();
    tempDir = path.join(process.env.TMPDIR || '/tmp', `skill-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should validate a skill with all required files', async () => {
    // Create skill structure
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });

    // Create SKILL.md with frontmatter
    const skillPath = path.join(skillDir, 'SKILL.md');
    await fs.writeFile(skillPath, '---\nname: test-skill\ndescription: Test skill\n---\nContent');

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    const result = await validator.validate(skill);

    expect(result.isValid()).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject skill without SKILL.md', async () => {
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    const result = await validator.validate(skill);

    expect(result.isValid()).toBe(false);
    expect(result.errors.some(e => e.issue.includes('SKILL.md'))).toBe(true);
  });

  it('should reject skill with invalid frontmatter', async () => {
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });

    const skillPath = path.join(skillDir, 'SKILL.md');
    await fs.writeFile(skillPath, 'No frontmatter here');

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    const result = await validator.validate(skill);

    expect(result.isValid()).toBe(false);
    expect(result.errors.some(e => e.field === 'frontmatter')).toBe(true);
  });

  it('should detect naming conflicts', async () => {
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });

    const skillPath = path.join(skillDir, 'SKILL.md');
    await fs.writeFile(skillPath, '---\nname: test-skill\n---\nContent');

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    // Create target directory with existing skill
    const targetDir = path.join(tempDir, 'target');
    await fs.mkdir(targetDir, { recursive: true });
    const existingSkill = path.join(targetDir, 'test-skill');
    await fs.mkdir(existingSkill, { recursive: true });
    await fs.writeFile(path.join(existingSkill, 'SKILL.md'), '---\nname: existing\n---\nContent');

    const result = await validator.validate(skill, {
      checkConflicts: true,
      targetDir: targetDir,
    });

    expect(result.warnings.some(w => w.field === 'naming')).toBe(true);
  });

  it('should validate skill at path', async () => {
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });

    const skillPath = path.join(skillDir, 'SKILL.md');
    await fs.writeFile(skillPath, '---\nname: test-skill\ndescription: Test\n---\nContent');

    const result = await validator.validateSkillAtPath(skillDir);

    expect(result.isValid()).toBe(true);
  });
});
