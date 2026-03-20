import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger.js';

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function copyDir(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest);
  logger.success(`Copied ${path.basename(src)} to ${path.basename(dest)}`);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function removeDir(dirPath: string): Promise<void> {
  await fs.remove(dirPath);
}

export function getProjectRoot(): string {
  return process.cwd();
}

export function getTemplatePath(templateName: string): string {
  return path.join(import.meta.dirname, '..', 'templates', templateName);
}
