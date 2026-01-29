/**
 * Agent Registry
 *
 * Manages registration and lookup of agent implementations.
 */

import type { Agent, AgentType } from '../types/index.js';
import { InvalidAgentError } from '../core/errors.js';
import { Logger, getLogger } from '../core/logger.js';

/**
 * Registry for managing agent implementations
 */
export class AgentRegistry {
  private agents: Map<AgentType, Agent> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = getLogger().child('registry');
  }

  /**
   * Register an agent
   *
   * @param agent - Agent to register
   * @throws Error if agent with same name already registered
   */
  register(agent: Agent): void {
    if (this.agents.has(agent.name)) {
      throw new Error(`Agent "${agent.name}" is already registered`);
    }

    this.agents.set(agent.name, agent);
    this.logger.debug(`Registered agent: ${agent.name}`);
  }

  /**
   * Get an agent by name
   *
   * @param name - Agent name
   * @returns Agent or undefined if not found
   */
  get(name: AgentType): Agent | undefined {
    return this.agents.get(name);
  }

  /**
   * Get an agent by name or throw if not found
   *
   * @param name - Agent name
   * @returns Agent
   * @throws InvalidAgentError if agent not found
   */
  getOrThrow(name: AgentType): Agent {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new InvalidAgentError(name, this.getSupportedNames());
    }
    return agent;
  }

  /**
   * Check if an agent is registered
   *
   * @param name - Agent name
   * @returns true if agent is registered
   */
  has(name: AgentType): boolean {
    return this.agents.has(name);
  }

  /**
   * Get all registered agents
   *
   * @returns Array of all agents
   */
  getAll(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get all supported agents
   *
   * @returns Array of supported agents
   */
  getSupported(): Agent[] {
    return Array.from(this.agents.values()).filter((agent) => agent.supported);
  }

  /**
   * Get names of all supported agents
   *
   * @returns Array of agent names
   */
  getSupportedNames(): string[] {
    return this.getSupported().map((agent) => agent.name);
  }

  /**
   * Detect all agents and return those that are installed
   *
   * @returns Array of detected agents
   */
  async detectAll(): Promise<Agent[]> {
    this.logger.debug('Detecting all agents...');

    const detectionPromises = Array.from(this.agents.values()).map(async (agent) => {
      const detected = await agent.detect();
      this.logger.debug(`${agent.name}: ${detected ? 'detected' : 'not detected'}`);
      return { agent, detected };
    });

    const results = await Promise.all(detectionPromises);
    const detected = results.filter((r) => r.detected).map((r) => r.agent);

    this.logger.info(`Detected ${detected.length}/${this.agents.size} agents`);

    return detected;
  }

  /**
   * Get detected agents
   *
   * @returns Array of detected agents
   */
  async getDetected(): Promise<Agent[]> {
    return this.detectAll();
  }

  /**
   * Get agent display information
   *
   * @returns Array of agent information
   */
  getAgentInfo(): Array<{
    name: string;
    displayName: string;
    supported: boolean;
    detected?: boolean;
  }> {
    return Array.from(this.agents.values()).map((agent) => ({
      name: agent.name,
      displayName: agent.displayName,
      supported: agent.supported,
      detected: undefined, // Call detectAll() to populate
    }));
  }

  /**
   * Clear all registered agents
   *
   * Mainly useful for testing
   */
  clear(): void {
    this.agents.clear();
    this.logger.debug('Cleared all agents');
  }

  /**
   * Get count of registered agents
   *
   * @returns Number of registered agents
   */
  get size(): number {
    return this.agents.size;
  }
}

/**
 * Create and initialize the agent registry with all agents
 */
export async function createAgentRegistry(): Promise<AgentRegistry> {
  const registry = new AgentRegistry();

  // Import and register all agent implementations
  const { ClaudeCodeAgent } = await import('./agents/claude-code.js');
  const { GitHubCopilotAgent } = await import('./agents/github-copilot.js');
  const { CursorAgent } = await import('./agents/cursor.js');
  const { OpenCodeAgent } = await import('./agents/opencode.js');

  registry.register(new ClaudeCodeAgent());
  registry.register(new GitHubCopilotAgent());
  registry.register(new CursorAgent());
  registry.register(new OpenCodeAgent());

  getLogger().info(`Registered ${registry.size} agents`);

  return registry;
}
