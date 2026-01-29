/**
 * Agent Registry tests
 */

import { AgentRegistry } from '../agent-registry.js';
import type { Agent, AgentType } from '../../types/index.js';

// Mock agent implementation
class MockAgent implements Agent {
  readonly name: AgentType = 'claude-code';
  readonly displayName = 'Mock Agent';
  readonly skillPath = '/mock/skills';
  readonly supported = true;

  async detect(): Promise<boolean> {
    return true;
  }

  async install(): Promise<any> {
    return { success: true, installedSkills: [], skippedSkills: [], errors: [], duration: 0 };
  }

  async verify(): Promise<boolean> {
    return true;
  }

  async uninstall(): Promise<void> {}

  async getInstalledSkills(): Promise<string[]> {
    return [];
  }
}

describe('AgentRegistry', () => {
  let registry: AgentRegistry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('should create empty registry', () => {
    expect(registry.size).toBe(0);
    expect(registry.getAll()).toHaveLength(0);
  });

  it('should register agent', () => {
    const agent = new MockAgent();
    registry.register(agent);
    expect(registry.size).toBe(1);
    expect(registry.has('claude-code')).toBe(true);
  });

  it('should get registered agent', () => {
    const agent = new MockAgent();
    registry.register(agent);
    const retrieved = registry.get('claude-code');
    expect(retrieved).toBe(agent);
  });

  it('should return undefined for non-existent agent', () => {
    const retrieved = registry.get('claude-code');
    expect(retrieved).toBeUndefined();
  });

  it('should throw when getting non-existent agent with getOrThrow', () => {
    expect(() => registry.getOrThrow('claude-code')).toThrow('Agent "claude-code" is not supported');
  });

  it('should get all registered agents', () => {
    const agent1 = new MockAgent();
    registry.register(agent1);
    const agents = registry.getAll();
    expect(agents).toHaveLength(1);
    expect(agents[0]).toBe(agent1);
  });

  it('should get supported agents', () => {
    const agent = new MockAgent();
    registry.register(agent);
    const supported = registry.getSupported();
    expect(supported).toHaveLength(1);
    expect(supported[0]).toBe(agent);
  });

  it('should get supported agent names', () => {
    const agent = new MockAgent();
    registry.register(agent);
    const names = registry.getSupportedNames();
    expect(names).toEqual(['claude-code']);
  });

  it('should detect all agents', async () => {
    const agent = new MockAgent();
    registry.register(agent);
    const detected = await registry.detectAll();
    expect(detected).toHaveLength(1);
    expect(detected[0]).toBe(agent);
  });

  it('should get agent info', () => {
    const agent = new MockAgent();
    registry.register(agent);
    const info = registry.getAgentInfo();
    expect(info).toHaveLength(1);
    expect(info[0]).toEqual({
      name: 'claude-code',
      displayName: 'Mock Agent',
      supported: true,
      detected: undefined,
    });
  });

  it('should clear all agents', () => {
    const agent = new MockAgent();
    registry.register(agent);
    expect(registry.size).toBe(1);
    registry.clear();
    expect(registry.size).toBe(0);
  });

  it('should throw when registering duplicate agent', () => {
    const agent = new MockAgent();
    registry.register(agent);
    expect(() => registry.register(agent)).toThrow('already registered');
  });
});
