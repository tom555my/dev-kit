import devKitInitSkillMd from '../../../.claude/skills/dev-kit-init/SKILL.md?raw';
import devKitRefineSkillMd from '../../../.claude/skills/dev-kit-refine/SKILL.md?raw';
import devKitResearchSkillMd from '../../../.claude/skills/dev-kit-research/SKILL.md?raw';
import devKitReviewSkillMd from '../../../.claude/skills/dev-kit-review/SKILL.md?raw';
import devKitTicketSkillMd from '../../../.claude/skills/dev-kit-ticket/SKILL.md?raw';
import devKitWorkSkillMd from '../../../.claude/skills/dev-kit-work/SKILL.md?raw';
import type { Skill } from '../types/index.js';

const EMBEDDED_SKILLS = {
  'dev-kit-init': devKitInitSkillMd,
  'dev-kit-refine': devKitRefineSkillMd,
  'dev-kit-research': devKitResearchSkillMd,
  'dev-kit-review': devKitReviewSkillMd,
  'dev-kit-ticket': devKitTicketSkillMd,
  'dev-kit-work': devKitWorkSkillMd,
};

export function getSkillContent(skillName: string): string {
  const skill = EMBEDDED_SKILLS[skillName as keyof typeof EMBEDDED_SKILLS];

  if (!skill) {
    throw new Error(`Skill not found: ${skillName}`);
  }

  return skill;
}

export function getAllSkillNames(): string[] {
  return Object.keys(EMBEDDED_SKILLS);
}

/**
 * List of dev-kit skills to install
 *
 * These are the 6 core dev-kit workflows
 */
export const DEV_KIT_SKILLS: string[] = [
  'dev-kit-init',
  'dev-kit-ticket',
  'dev-kit-research',
  'dev-kit-work',
  'dev-kit-refine',
  'dev-kit-review',
];

/**
 * Get skill metadata for all dev-kit skills
 *
 * Skills are embedded in the CLI binary at build time.
 *
 * @param _skillsPath - Path to skills directory (ignored, used for backward compatibility)
 * @returns Array of skill metadata with embedded content
 */
export function getDevKitSkills(_skillsPath: string): Skill[] {
  return getAllSkillNames().map((skillName) => {
    const content = getSkillContent(skillName);

    return {
      name: skillName,
      sourcePath: '', // Empty for embedded skills
      content, // Embedded skill content
      targetPath: '', // Will be set by installer
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code', 'github-copilot'] as const,
      frontmatter: {},
    };
  });
}
