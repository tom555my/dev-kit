/**
 * dev-kit CLI Type Definitions
 *
 * This file contains all core type definitions for the dev-kit CLI.
 * These interfaces are used across all modules and define the contract
 * between components.
 */

/**
 * Supported agent types
 */
export type AgentType = 'claude-code' | 'github-copilot' | 'cursor' | 'opencode';

/**
 * Skill metadata and installation information
 */
export interface Skill {
  /** Unique identifier (e.g., "dev-kit-init") */
  name: string;

  /** Human-readable description from YAML frontmatter */
  description?: string;

  /** Source path (embedded in binary) */
  sourcePath: string;

  /** Skill content (embedded, optional if using sourcePath) */
  content?: string;

  /** Target path (agent-specific installation location) */
  targetPath: string;

  /** Required files and directories */
  requiredFiles: string[];

  /** Skill dependencies (other skills that must be installed) */
  dependencies?: string[];

  /** Compatible agents */
  compatibleAgents: AgentType[];

  /** Parsed YAML frontmatter */
  frontmatter: SkillFrontmatter;
}

/**
 * Parsed YAML frontmatter from SKILL.md
 */
export interface SkillFrontmatter {
  /** Skill name (optional, defaults to directory name) */
  name?: string;

  /** Skill description */
  description?: string;

  /** Argument hint shown in autocomplete */
  'argument-hint'?: string;

  /** Prevent auto-trigger by pattern matching */
  'disable-model-invocation'?: boolean;

  /** Hide from / menu (default: true) */
  'user-invocable'?: boolean;

  /** Allowed tools for Claude to use */
  'allowed-tools'?: string[];

  /** Model override (e.g., "claude-sonnet-4.5") */
  model?: string;

  /** Execution context: "fork" for subagent */
  context?: 'fork';

  /** Which subagent type to use */
  agent?: string;

  /** Lifecycle hooks */
  hooks?: {
    preCommand?: string;
    postCommand?: string;
  };
}

/**
 * Result of a skill installation operation
 */
export interface InstallResult {
  /** Overall success status */
  success: boolean;

  /** Successfully installed skills */
  installedSkills: string[];

  /** Skipped skills (already installed) */
  skippedSkills: string[];

  /** Failed installations with error messages */
  errors: Array<{
    skill: string;
    error: string;
  }>;

  /** Rollback function to undo installation */
  rollback: () => Promise<void>;

  /** Installation duration in milliseconds */
  duration: number;
}

/**
 * Validation result for skills or configuration
 */
export interface ValidationResult {
  /** Validation errors */
  errors: ValidationError[];

  /** Validation warnings */
  warnings: ValidationError[];

  /** Check if validation passed (no errors) */
  isValid(): boolean;
}

/**
 * Single validation error or warning
 */
export interface ValidationError {
  /** Field or property being validated */
  field: string;

  /** Description of the issue */
  issue: string;

  /** Severity level */
  severity: 'error' | 'warning';
}

/**
 * Agent interface - all agents must implement this
 */
export interface Agent {
  /** Unique identifier */
  readonly name: AgentType;

  /** Human-readable name */
  readonly displayName: string;

  /** Path to skill directory */
  readonly skillPath: string;

  /** Is this agent supported for installation? */
  readonly supported: boolean;

  /** Reason why agent is not supported (if applicable) */
  readonly unsupportedReason?: string;

  /**
   * Detect if this agent is installed on the system
   * @returns Promise<boolean> - true if agent detected
   */
  detect(): Promise<boolean>;

  /**
   * Install a skill for this agent
   * @param skill - Skill to install
   * @param options - Installation options
   * @returns Promise<InstallResult> - Installation result with rollback
   */
  install(skill: Skill, options?: InstallOptions): Promise<InstallResult>;

  /**
   * Verify that a skill is correctly installed
   * @param skillName - Name of skill to verify
   * @returns Promise<boolean> - true if skill is valid
   */
  verify(skillName: string): Promise<boolean>;

  /**
   * Uninstall a skill
   * @param skillName - Name of skill to uninstall
   */
  uninstall(skillName: string): Promise<void>;

  /**
   * Get list of installed skills
   * @returns Promise<string[]> - Array of installed skill names
   */
  getInstalledSkills(): Promise<string[]>;
}

/**
 * Agent metadata (information about an agent)
 */
export interface AgentMetadata {
  /** Unique identifier */
  name: AgentType;

  /** Human-readable name */
  displayName: string;

  /** Path to skill directory */
  skillPath: string;

  /** Is this agent supported? */
  supported: boolean;

  /** Why unsupported? (if applicable) */
  unsupportedReason?: string;

  /** Installation priority (1 = highest) */
  priority: number;

  /** Detected on this system? */
  detected: boolean;
}

/**
 * User configuration stored in ~/.dev-kit/config.json
 */
export interface UserConfig {
  /** Config version (for migrations) */
  version: string;

  /** User's preferred agents (ordered by priority) */
  preferredAgents: AgentType[];

  /** Custom installation paths for agents */
  installationPaths: Partial<Record<AgentType, string>>;

  /** CLI preferences */
  preferences: UserPreferences;

  /** Last update check timestamp */
  lastUpdateCheck?: string;

  /** CLI version when config was created */
  cliVersion: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** Enable verbose output */
  verbose: boolean;

  /** Automatically check for updates */
  autoUpdate: boolean;

  /** Enable colored output */
  colorOutput: boolean;

  /** Confirm before installing skills */
  confirmBeforeInstall: boolean;
}

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  verbose: false,
  autoUpdate: true,
  colorOutput: true,
  confirmBeforeInstall: true,
};

/**
 * Installation options for skill installer
 */
export interface InstallOptions {
  /** Overwrite existing skills? */
  overwrite?: boolean;

  /** Create backup before installing? */
  backup?: boolean;

  /** Dry run (show what would be done)? */
  dryRun?: boolean;

  /** Skip validation? */
  skipValidation?: boolean;
}

/**
 * Command handler interface
 */
export interface CommandHandler {
  /**
   * Execute the command
   * @param args - Command arguments
   */
  execute(args: string[]): Promise<void>;
}

/**
 * CLI command configuration
 */
export interface CommandConfig {
  /** Command name */
  name: string;

  /** Command description */
  description: string;

  /** Arguments definition */
  args?: ArgumentConfig[];

  /** Options/flags */
  options?: OptionConfig[];
}

/**
 * Command argument configuration
 */
export interface ArgumentConfig {
  /** Argument name */
  name: string;

  /** Description */
  description: string;

  /** Is argument required? */
  required: boolean;

  /** Default value (if not required) */
  default?: string;
}

/**
 * Command option/flag configuration
 */
export interface OptionConfig {
  /** Option flag (e.g., "--verbose", "-v") */
  flag: string;

  /** Description */
  description: string;

  /** Is this a boolean flag? */
  isBoolean?: boolean;

  /** Default value */
  default?: string | boolean;
}

/**
 * Error types
 */

/**
 * Base error class for all CLI errors
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

/**
 * User error (invalid input, environment issues)
 */
export class UserError extends CLIError {
  constructor(message: string, suggestion?: string) {
    super(message, 'USER_ERROR', suggestion);
    this.name = 'UserError';
  }
}

/**
 * System error (file system, runtime errors)
 */
export class SystemError extends CLIError {
  constructor(message: string, public cause?: Error) {
    super(message, 'SYSTEM_ERROR');
    this.name = 'SystemError';
  }
}

/**
 * Validation error (invalid structure, missing fields)
 */
export class ValidationError extends CLIError {
  constructor(message: string, public issues: ValidationError[]) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Resource manager interface
 */
export interface ResourceManager {
  /**
   * Get a skill by name
   * @param skillName - Name of skill to retrieve
   * @returns Skill or undefined if not found
   */
  getSkill(skillName: string): Skill | undefined;

  /**
   * Get onboarding guide content
   * @returns Promise<string> - Onboarding guide markdown
   */
  getOnboardingGuide(): Promise<string>;

  /**
   * List all available skills
   * @returns Array of skill names
   */
  listSkills(): string[];

  /**
   * Extract all embedded resources to a directory
   * @param targetDir - Target directory
   */
  extractAll(targetDir: string): Promise<void>;
}

/**
 * Config manager interface
 */
export interface ConfigManager {
  /**
   * Load user configuration
   * @returns Promise<UserConfig> - User configuration
   */
  load(): Promise<UserConfig>;

  /**
   * Save user configuration
   * @param config - Configuration to save
   */
  save(config: UserConfig): Promise<void>;

  /**
   * Validate configuration
   * @param config - Configuration to validate
   * @returns Promise<ValidationResult> - Validation result
   */
  validate(config: UserConfig): Promise<ValidationResult>;

  /**
   * Migrate configuration from old version
   * @param oldConfig - Old configuration
   * @returns Promise<UserConfig> - Migrated configuration
   */
  migrate(oldConfig: any): Promise<UserConfig>;
}

/**
 * Agent registry interface
 */
export interface AgentRegistry {
  /**
   * Register an agent
   * @param agent - Agent to register
   */
  register(agent: Agent): void;

  /**
   * Get an agent by name
   * @param name - Agent name
   * @returns Agent or undefined
   */
  get(name: AgentType): Agent | undefined;

  /**
   * Detect all agents
   * @returns Promise<Agent[]> - Array of detected agents
   */
  detectAll(): Promise<Agent[]>;

  /**
   * Get all supported agents
   * @returns Array of supported agents
   */
  getSupported(): Agent[];
}

/**
 * Skill installer interface
 */
export interface SkillInstaller {
  /**
   * Install a skill
   * @param skill - Skill to install
   * @param targetPath - Target installation path
   * @param options - Installation options
   * @returns Promise<InstallResult> - Installation result
   */
  install(
    skill: Skill,
    targetPath: string,
    options?: InstallOptions
  ): Promise<InstallResult>;

  /**
   * Validate a skill
   * @param skill - Skill to validate
   * @returns Promise<ValidationResult> - Validation result
   */
  validate(skill: Skill): Promise<ValidationResult>;

  /**
   * Backup existing installation
   * @param targetPath - Path to backup
   * @returns Promise<string> - Backup path
   */
  backup(targetPath: string): Promise<string>;

  /**
   * Rollback installation
   * @param backupPath - Path to restore from
   */
  rollback(backupPath: string): Promise<void>;
}

/**
 * CLI version info
 */
export interface VersionInfo {
  /** CLI version */
  version: string;

  /** Build timestamp */
  buildTime?: string;

  /** Git commit hash */
  commitHash?: string;

  /** Bun version used to build */
  bunVersion?: string;
}

/**
 * Onboarding display options
 */
export interface OnboardingOptions {
  /** Output format */
  format: 'markdown' | 'terminal';

  /** Output file path (optional) */
  output?: string;

  /** Show specific section only */
  section?: string;
}
