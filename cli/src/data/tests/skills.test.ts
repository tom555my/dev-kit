/**
 * Skills data module tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSkillContent,
  getAllSkillNames,
  DEV_KIT_SKILLS,
  getDevKitSkills,
} from '../skills.js';

describe('Skills Data Module', () => {
  describe('getSkillContent', () => {
    it('should return content for valid skill names', () => {
      const skillNames = getAllSkillNames();

      for (const skillName of skillNames) {
        const content = getSkillContent(skillName);
        expect(content).toBeDefined();
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
      }
    });

    it('should throw error for invalid skill name', () => {
      expect(() => getSkillContent('non-existent-skill')).toThrow('Skill not found: non-existent-skill');
    });

    it('should return markdown content with frontmatter', () => {
      const content = getSkillContent('dev-kit-init');
      expect(content).toMatch(/^---/);
      expect(content).toContain('description:');
    });
  });

  describe('getAllSkillNames', () => {
    it('should return all 6 dev-kit skill names', () => {
      const names = getAllSkillNames();
      expect(names).toHaveLength(6);
      expect(names).toEqual(expect.arrayContaining(DEV_KIT_SKILLS));
    });

    it('should contain expected skill names', () => {
      const names = getAllSkillNames();
      const expectedSkills = [
        'dev-kit-init',
        'dev-kit-ticket',
        'dev-kit-research',
        'dev-kit-work',
        'dev-kit-refine',
        'dev-kit-review',
      ];
      expect(names).toEqual(expect.arrayContaining(expectedSkills));
    });

    it('should return unique skill names', () => {
      const names = getAllSkillNames();
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('DEV_KIT_SKILLS constant', () => {
    it('should contain 6 skills', () => {
      expect(DEV_KIT_SKILLS).toHaveLength(6);
    });

    it('should match getAllSkillNames (order-insensitive)', () => {
      const allNames = getAllSkillNames();
      expect(DEV_KIT_SKILLS).toEqual(expect.arrayContaining(allNames));
      expect(allNames).toEqual(expect.arrayContaining(DEV_KIT_SKILLS));
    });
  });

  describe('getDevKitSkills', () => {
    it('should return array of skills', () => {
      const skills = getDevKitSkills('/any/path');
      expect(Array.isArray(skills)).toBe(true);
    });

    it('should return 6 skills', () => {
      const skills = getDevKitSkills('/any/path');
      expect(skills).toHaveLength(6);
    });

    it('should return skills with correct structure', () => {
      const skills = getDevKitSkills('/any/path');

      for (const skill of skills) {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('sourcePath');
        expect(skill).toHaveProperty('content');
        expect(skill).toHaveProperty('targetPath');
        expect(skill).toHaveProperty('requiredFiles');
        expect(skill).toHaveProperty('compatibleAgents');
        expect(skill).toHaveProperty('frontmatter');
      }
    });

    it('should have skill names matching DEV_KIT_SKILLS', () => {
      const skills = getDevKitSkills('/any/path');
      const skillNames = skills.map((s) => s.name);
      expect(skillNames).toEqual(expect.arrayContaining(DEV_KIT_SKILLS));
      expect(skillNames).toHaveLength(DEV_KIT_SKILLS.length);
    });

    it('should have embedded content for each skill', () => {
      const skills = getDevKitSkills('/any/path');

      for (const skill of skills) {
        expect(skill.content).toBeDefined();
        expect(skill.content.length).toBeGreaterThan(0);
        expect(skill.sourcePath).toBe(''); // Empty for embedded skills
      }
    });

    it('should have requiredFiles array', () => {
      const skills = getDevKitSkills('/any/path');

      for (const skill of skills) {
        expect(skill.requiredFiles).toEqual(['SKILL.md']);
      }
    });

    it('should have compatible agents', () => {
      const skills = getDevKitSkills('/any/path');

      for (const skill of skills) {
        expect(skill.compatibleAgents).toContain('claude-code');
        expect(skill.compatibleAgents).toContain('github-copilot');
      }
    });

    it('should have empty targetPath initially', () => {
      const skills = getDevKitSkills('/any/path');

      for (const skill of skills) {
        expect(skill.targetPath).toBe('');
      }
    });

    it('should have frontmatter object', () => {
      const skills = getDevKitSkills('/any/path');

      for (const skill of skills) {
        expect(typeof skill.frontmatter).toBe('object');
        expect(Array.isArray(skill.frontmatter)).toBe(false);
      }
    });
  });

  describe('Resource Bundling Edge Cases', () => {
    it('should handle concurrent calls to getSkillContent', async () => {
      const skillName = 'dev-kit-init';
      const promises = Array(10).fill(null).map(() => Promise.resolve(getSkillContent(skillName)));
      const results = await Promise.all(promises);

      for (const result of results) {
        expect(result).toBeDefined();
        expect(result).toBe(results[0]); // All should be identical
      }
    });

    it('should handle multiple calls to getDevKitSkills', () => {
      const skills1 = getDevKitSkills('/path1');
      const skills2 = getDevKitSkills('/path2');

      expect(skills1).toEqual(skills2);
    });
  });

  describe('Skill Content Validation', () => {
    it('should contain valid YAML frontmatter for all skills', () => {
      const names = getAllSkillNames();

      for (const name of names) {
        const content = getSkillContent(name);
        expect(content).toMatch(/^---\s*\n/); // Starts with YAML delimiter
        expect(content).toMatch(/\n---\s*\n/); // Has YAML closing delimiter
      }
    });

    it('should have description in frontmatter', () => {
      const names = getAllSkillNames();

      for (const name of names) {
        const content = getSkillContent(name);
        expect(content).toMatch(/description:/);
      }
    });
  });
});
