/**
 * Performance and Load Tests
 */

import { describe, it, expect } from 'vitest';
import { getDevKitSkills, getAllSkillNames } from '../data/skills.js';
import { createAgentRegistry } from '../agents/agent-registry.js';

describe('Performance Tests', () => {
  describe('CLI Startup Time', () => {
    it('should load skills data quickly', () => {
      const startTime = performance.now();

      const skills = getDevKitSkills('/any/path');

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(skills).toBeDefined();
      expect(duration).toBeLessThan(100); // Should load in under 100ms
    });

    it('should get skill names quickly', () => {
      const startTime = performance.now();

      const names = getAllSkillNames();

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(names).toBeDefined();
      expect(duration).toBeLessThan(10); // Should be nearly instant (< 10ms)
    });
  });

  describe('Large File Operations', () => {
    it('should handle large skill content efficiently', () => {
      const { getSkillContent } = require('../data/skills.js');
      const startTime = performance.now();

      // Load all skills
      const names = getAllSkillNames();
      for (const name of names) {
        const content = getSkillContent(name);
        expect(content.length).toBeGreaterThan(0);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(200); // Should load all skills in under 200ms
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory when loading skills repeatedly', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Load skills 100 times
      for (let i = 0; i < 100; i++) {
        const skills = getDevKitSkills('/any/path');
        expect(skills).toBeDefined();
      }

      // Force garbage collection if available (requires --expose-gc flag)
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      // This is a loose threshold as GC is not guaranteed
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Agent Detection Performance', () => {
    it('should detect agents quickly', async () => {
      const startTime = performance.now();

      const registry = await createAgentRegistry();

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(registry).toBeDefined();
      expect(duration).toBeLessThan(500); // Should initialize in under 500ms
    });

    it('should get agents quickly', async () => {
      const registry = await createAgentRegistry();
      const startTime = performance.now();

      const agents = registry.getAll();

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(agents).toBeDefined();
      expect(duration).toBeLessThan(10); // Should be nearly instant
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent skill loading', async () => {
      const startTime = performance.now();

      // Load all skills concurrently
      const promises = Array(10).fill(null).map(() =>
        Promise.resolve(getDevKitSkills('/any/path'))
      );

      const results = await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(500); // Should handle concurrency efficiently
    });
  });

  describe('Resource Efficiency', () => {
    it('should not duplicate skill data in memory', () => {
      const skills1 = getDevKitSkills('/any/path');
      const skills2 = getDevKitSkills('/any/path');

      // Same content should be returned (not duplicated)
      expect(skills1[0].content).toBe(skills2[0].content);
    });

    it('should cache skill content efficiently', () => {
      const { getSkillContent } = require('../data/skills.js');
      const startTime = performance.now();

      // Load same skill multiple times
      const content1 = getSkillContent('dev-kit-init');
      const content2 = getSkillContent('dev-kit-init');
      const content3 = getSkillContent('dev-kit-init');

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(content1).toBe(content2);
      expect(content2).toBe(content3);
      expect(duration).toBeLessThan(5); // Should be cached and very fast
    });
  });
});
