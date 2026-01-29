/**
 * File Operations Tests
 */

import { FileOperations, CopyOptions, pathExists } from '../file-ops.js';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('FileOperations', () => {
  let fileOps: FileOperations;
  let tempDir: string;

  beforeEach(async () => {
    fileOps = new FileOperations();
    tempDir = path.join(process.env.TMPDIR || '/tmp', `fileops-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should copy directory recursively', async () => {
    // Create source structure
    const sourceDir = path.join(tempDir, 'source');
    await fs.mkdir(sourceDir, { recursive: true });

    await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'content1');
    await fs.writeFile(path.join(sourceDir, 'file2.txt'), 'content2');

    const subDir = path.join(sourceDir, 'subdir');
    await fs.mkdir(subDir, { recursive: true });
    await fs.writeFile(path.join(subDir, 'file3.txt'), 'content3');

    // Copy to target
    const targetDir = path.join(tempDir, 'target');
    const fileCount = await fileOps.copyDirectory(sourceDir, targetDir);

    expect(fileCount).toBe(3);

    // Verify files copied
    expect(await pathExists(path.join(targetDir, 'file1.txt'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'file2.txt'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'subdir', 'file3.txt'))).toBe(true);
  });

  it('should respect overwrite option', async () => {
    const sourceDir = path.join(tempDir, 'source');
    const targetDir = path.join(tempDir, 'target');

    await fs.mkdir(sourceDir, { recursive: true });
    await fs.mkdir(targetDir, { recursive: true });

    const sourceFile = path.join(sourceDir, 'file.txt');
    const targetFile = path.join(targetDir, 'file.txt');

    await fs.writeFile(sourceFile, 'new content');
    await fs.writeFile(targetFile, 'old content');

    // Copy without overwrite
    await fileOps.copyDirectory(sourceDir, targetDir, { overwrite: false });

    let content = await fs.readFile(targetFile, 'utf-8');
    expect(content).toBe('old content');

    // Copy with overwrite
    await fileOps.copyDirectory(sourceDir, targetDir, { overwrite: true });

    content = await fs.readFile(targetFile, 'utf-8');
    expect(content).toBe('new content');
  });

  it('should count files correctly', async () => {
    const testDir = path.join(tempDir, 'test');
    await fs.mkdir(testDir, { recursive: true });

    await fs.writeFile(path.join(testDir, 'file1.txt'), 'content1');
    await fs.writeFile(path.join(testDir, 'file2.txt'), 'content2');

    const subDir = path.join(testDir, 'subdir');
    await fs.mkdir(subDir, { recursive: true });
    await fs.writeFile(path.join(subDir, 'file3.txt'), 'content3');

    const count = await fileOps.countFiles(testDir);
    expect(count).toBe(3);
  });

  it('should remove directory recursively', async () => {
    const testDir = path.join(tempDir, 'remove-test');
    await fs.mkdir(testDir, { recursive: true });

    await fs.writeFile(path.join(testDir, 'file.txt'), 'content');

    const subDir = path.join(testDir, 'subdir');
    await fs.mkdir(subDir, { recursive: true });
    await fs.writeFile(path.join(subDir, 'file2.txt'), 'content2');

    await fileOps.removeDirectory(testDir);

    const exists = await fileOps.pathExists(testDir);
    expect(exists).toBe(false);
  });

  it('should create and restore backup', async () => {
    const sourceDir = path.join(tempDir, 'source');
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.writeFile(path.join(sourceDir, 'file.txt'), 'original');

    const backupDir = path.join(tempDir, 'backups');
    const backupPath = await fileOps.backupDirectory(sourceDir, backupDir);

    expect(await pathExists(backupPath)).toBe(true);
    expect(await pathExists(path.join(backupPath, 'file.txt'))).toBe(true);

    // Modify source
    await fs.writeFile(path.join(sourceDir, 'file.txt'), 'modified');

    // Restore backup
    await fileOps.restoreBackup(backupPath, sourceDir);

    const content = await fs.readFile(path.join(sourceDir, 'file.txt'), 'utf-8');
    expect(content).toBe('original');
  });

  it('should check path existence', async () => {
    const existingPath = path.join(tempDir, 'existing');
    const nonExistentPath = path.join(tempDir, 'nonexistent');

    await fs.mkdir(existingPath, { recursive: true });

    expect(await fileOps.pathExists(existingPath)).toBe(true);
    expect(await fileOps.pathExists(nonExistentPath)).toBe(false);
  });

  it('should report progress during copy', async () => {
    const sourceDir = path.join(tempDir, 'source');
    await fs.mkdir(sourceDir, { recursive: true });

    await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'content1');
    await fs.writeFile(path.join(sourceDir, 'file2.txt'), 'content2');

    const progressCalls: number[] = [];

    const targetDir = path.join(tempDir, 'target');
    await fileOps.copyDirectory(sourceDir, targetDir, {
      onProgress: (current, total, file) => {
        progressCalls.push(current);
      },
    });

    expect(progressCalls).toEqual([1, 2]);
  });
});
