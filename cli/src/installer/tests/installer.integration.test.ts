/**
 * Skill Installer Integration Tests
 *
 * Tests the full installation workflow with real file operations
 */

import { SkillInstaller, InstallOptions } from '../installer.js';
import { FileOperations, pathExists } from '../file-ops.js';
import type { Skill } from '../../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Skill Installer Integration', () => {
  let installer: SkillInstaller;
  let fileOps: FileOperations;
  let tempDir: string;

  beforeEach(async () => {
    installer = new SkillInstaller();
    fileOps = new FileOperations();
    tempDir = path.join(process.env.TMPDIR || '/tmp', `installer-integration-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should install a complete skill', async () => {
    // Create a skill
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });

    await fs.writeFile(
      path.join(skillDir, 'SKILL.md'),
      '---\nname: test-skill\ndescription: A test skill\n---\n# Test Skill\n\nThis is a test skill.'
    );

    await fs.writeFile(path.join(skillDir, 'template.md'), 'Template content');

    const examplesDir = path.join(skillDir, 'examples');
    await fs.mkdir(examplesDir, { recursive: true });
    await fs.writeFile(path.join(examplesDir, 'example.md'), 'Example content');

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md', 'template.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    // Install skill
    const targetDir = path.join(tempDir, 'target');
    await fs.mkdir(targetDir, { recursive: true });

    const result = await installer.install(skill, targetDir);

    expect(result.success).toBe(true);
    expect(result.installedSkills).toContain('test-skill');

    // Verify files were copied
    const installedSkillDir = path.join(targetDir, 'test-skill');
    expect(await pathExists(path.join(installedSkillDir, 'SKILL.md'))).toBe(true);
    expect(await pathExists(path.join(installedSkillDir, 'template.md'))).toBe(true);
    expect(await pathExists(path.join(installedSkillDir, 'examples', 'example.md'))).toBe(true);
  });

  it('should rollback on validation failure', async () => {
    const skillDir = path.join(tempDir, 'invalid-skill');
    await fs.mkdir(skillDir, { recursive: true });

    // Create invalid skill (no SKILL.md)
    await fs.writeFile(path.join(skillDir, 'readme.md'), 'No SKILL.md');

    const skill: Skill = {
      name: 'invalid-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    const targetDir = path.join(tempDir, 'target');
    await fs.mkdir(targetDir, { recursive: true });

    const result = await installer.install(skill, targetDir);

    expect(result.success).toBe(false);
    expect(result.installedSkills).toHaveLength(0);

    // Verify nothing was left behind
    const installedPath = path.join(targetDir, 'invalid-skill');
    expect(await pathExists(installedPath)).toBe(false);
  });

  it('should handle overwrite correctly', async () => {
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(
      path.join(skillDir, 'SKILL.md'),
      '---\nname: test-skill\n---\nVersion 2'
    );

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    const targetDir = path.join(tempDir, 'target');
    await fs.mkdir(targetDir, { recursive: true });

    // Install first version
    const targetPath = path.join(targetDir, 'test-skill');
    await fs.mkdir(targetPath, { recursive: true });
    await fs.writeFile(
      path.join(targetPath, 'SKILL.md'),
      '---\nname: test-skill\n---\nVersion 1'
    );

    // Install with overwrite
    const result = await installer.install(skill, targetDir, { overwrite: true });

    expect(result.success).toBe(true);

    // Verify file was overwritten
    const content = await fs.readFile(path.join(targetPath, 'SKILL.md'), 'utf-8');
    expect(content).toContain('Version 2');
  });

  it('should skip existing skills without overwrite', async () => {
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(
      path.join(skillDir, 'SKILL.md'),
      '---\nname: test-skill\n---\nNew content'
    );

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    const targetDir = path.join(tempDir, 'target');
    await fs.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, 'test-skill');
    await fs.mkdir(targetPath, { recursive: true });
    await fs.writeFile(
      path.join(targetPath, 'SKILL.md'),
      '---\nname: test-skill\n---\nOriginal content'
    );

    // Install without overwrite
    const result = await installer.install(skill, targetDir, { overwrite: false });

    expect(result.success).toBe(true);
    expect(result.skippedSkills).toContain('test-skill');

    // Verify original content is unchanged
    const content = await fs.readFile(path.join(targetPath, 'SKILL.md'), 'utf-8');
    expect(content).toContain('Original content');
  });

  it('should report progress during installation', async () => {
    const skillDir = path.join(tempDir, 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });

    await fs.writeFile(path.join(skillDir, 'SKILL.md'), '---\nname: test-skill\n---\n');
    await fs.writeFile(path.join(skillDir, 'file1.txt'), 'content1');
    await fs.writeFile(path.join(skillDir, 'file2.txt'), 'content2');

    const skill: Skill = {
      name: 'test-skill',
      sourcePath: skillDir,
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    };

    const targetDir = path.join(tempDir, 'target');
    await fs.mkdir(targetDir, { recursive: true });

    const progressCalls: number[] = [];

    await installer.install(skill, targetDir, {
      onProgress: (current, total, file) => {
        progressCalls.push(current);
      },
    });

    expect(progressCalls.length).toBeGreaterThan(0);
  });

  it('should install multiple skills', async () => {
    // Create skills
    const skill1Dir = path.join(tempDir, 'skill1');
    await fs.mkdir(skill1Dir, { recursive: true });
    await fs.writeFile(path.join(skill1Dir, 'SKILL.md'), '---\nname: skill1\n---\n');

    const skill2Dir = path.join(tempDir, 'skill2');
    await fs.mkdir(skill2Dir, { recursive: true });
    await fs.writeFile(path.join(skill2Dir, 'SKILL.md'), '---\nname: skill2\n---\n');

    const skills: Skill[] = [
      {
        name: 'skill1',
        sourcePath: skill1Dir,
        targetPath: '',
        requiredFiles: ['SKILL.md'],
        compatibleAgents: ['claude-code'],
        frontmatter: {},
      },
      {
        name: 'skill2',
        sourcePath: skill2Dir,
        targetPath: '',
        requiredFiles: ['SKILL.md'],
        compatibleAgents: ['claude-code'],
        frontmatter: {},
      },
    ];

    const targetDir = path.join(tempDir, 'target');
    await fs.mkdir(targetDir, { recursive: true });

    const result = await installer.installMultiple(skills, targetDir);

    expect(result.success).toBe(true);
    expect(result.installedSkills).toHaveLength(2);

    // Verify both skills installed
    expect(await pathExists(path.join(targetDir, 'skill1'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'skill2'))).toBe(true);
  });
});
