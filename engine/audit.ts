import { readFile } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs/promises';

export interface AuditIssue {
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  file: string;
  line?: number;
  suggestion?: string;
  wcagCriteria?: string;
}

export interface AuditResult {
  passed: boolean;
  score: number;
  issues: AuditIssue[];
  checkedAt: string;
  filesChecked: number;
}

export interface AuditOptions {
  fix?: boolean;
  wcagLevel?: 'A' | 'AA' | 'AAA';
  exclude?: string[];
}

const wcagRules = [
  {
    id: '1.1.1',
    title: 'Non-text Content',
    description: 'All non-text content has a text alternative',
    level: 'A' as const,
    check: 'alt-attributes'
  },
  {
    id: '1.3.1',
    title: 'Info and Relationships',
    description: 'Information structure is programmatically determinable',
    level: 'A' as const,
    check: 'semantic-html'
  },
  {
    id: '1.4.1',
    title: 'Use of Color',
    description: 'Color is not the only means of conveying information',
    level: 'A' as const,
    check: 'color-alone'
  },
  {
    id: '1.4.3',
    title: 'Contrast (Minimum)',
    description: 'Text has a contrast ratio of at least 4.5:1',
    level: 'AA' as const,
    check: 'contrast-ratio'
  },
  {
    id: '2.1.1',
    title: 'Keyboard',
    description: 'All functionality is keyboard accessible',
    level: 'A' as const,
    check: 'keyboard-accessible'
  },
  {
    id: '2.4.1',
    title: 'Bypass Blocks',
    description: 'Skip navigation links are provided',
    level: 'A' as const,
    check: 'skip-links'
  },
  {
    id: '2.4.2',
    title: 'Page Titled',
    description: 'Pages have descriptive titles',
    level: 'A' as const,
    check: 'page-titles'
  },
  {
    id: '2.4.4',
    title: 'Link Purpose (In Context)',
    description: 'Link purpose is determinable from link text',
    level: 'A' as const,
    check: 'link-text'
  },
  {
    id: '2.4.7',
    title: 'Focus Visible',
    description: 'Keyboard focus indicator is visible',
    level: 'AA' as const,
    check: 'focus-visible'
  },
  {
    id: '3.1.1',
    title: 'Language of Page',
    description: 'Page language is programmatically determinable',
    level: 'A' as const,
    check: 'lang-attribute'
  },
];

export class AuditTool {
  static async runAudit(
    projectPath: string,
    options: AuditOptions = {}
  ): Promise<AuditResult> {
    const issues: AuditIssue[] = [];
    let filesChecked = 0;

    const tsxFiles = await AuditTool.findTsxFiles(projectPath);
    
    for (const file of tsxFiles) {
      filesChecked++;
      const content = await readFile(file);
      const fileIssues = await AuditTool.auditFile(content, file, options);
      issues.push(...fileIssues);
    }

    const score = AuditTool.calculateScore(issues);
    const passed = issues.filter(i => i.severity === 'error').length === 0;

    return {
      passed,
      score,
      issues,
      checkedAt: new Date().toISOString(),
      filesChecked
    };
  }

  private static async findTsxFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '.next') continue;
          const subFiles = await this.findTsxFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch {
      // Ignore permission errors
    }
    
    return files;
  }

  private static async auditFile(
    content: string,
    filePath: string,
    options: AuditOptions
  ): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];

    const imgWithoutAlt = /<img(?![^>]*alt=)[^>]*>/gi;
    let match;
    while ((match = imgWithoutAlt.exec(content)) !== null) {
      issues.push({
        severity: 'error',
        title: 'Missing alt attribute',
        description: 'Images must have alt text for screen readers',
        file: filePath,
        suggestion: 'Add alt="description" or alt="" for decorative images',
        wcagCriteria: '1.1.1 - Non-text Content'
      });
    }

    const lowContrast = /style=\{[^}]*(?:background-color|color):[^}]*\}/gi;
    while ((match = lowContrast.exec(content)) !== null) {
      issues.push({
        severity: 'warning',
        title: 'Potential low contrast',
        description: 'Inline styles may not meet contrast requirements',
        file: filePath,
        suggestion: 'Use Tailwind contrast utilities (text-foreground, bg-background)',
        wcagCriteria: '1.4.3 - Contrast (Minimum)'
      });
    }

    const buttonsWithoutType = /<button(?![^>]*type=)[^>]*>/gi;
    while ((match = buttonsWithoutType.exec(content)) !== null) {
      issues.push({
        severity: 'info',
        title: 'Button without type attribute',
        description: 'Buttons should have explicit type attributes',
        file: filePath,
        suggestion: 'Add type="button" or type="submit"',
        wcagCriteria: '1.3.1 - Info and Relationships'
      });
    }

    const divsWithClick = /<div(?![^>]*role=)[^>]*onClick[^>]*>/gi;
    while ((match = divsWithClick.exec(content)) !== null) {
      issues.push({
        severity: 'warning',
        title: 'Clickable div without ARIA role',
        description: 'Interactive elements should use semantic HTML or ARIA',
        file: filePath,
        suggestion: 'Use <button> or add role="button" with keyboard handlers',
        wcagCriteria: '2.1.1 - Keyboard'
      });
    }

    const ariaWithoutLabel = /aria-label\s*=\s*["']\s*["']/gi;
    while ((match = ariaWithoutLabel.exec(content)) !== null) {
      issues.push({
        severity: 'error',
        title: 'Empty aria-label',
        description: 'ARIA labels must not be empty',
        file: filePath,
        suggestion: 'Provide meaningful label text or use aria-labelledby',
        wcagCriteria: '1.3.1 - Info and Relationships'
      });
    }

    if (!content.includes('<html') && content.includes('lang=')) {
      issues.push({
        severity: 'info',
        title: 'Check language attribute',
        description: 'Ensure html element has lang attribute',
        file: filePath,
        suggestion: 'Add lang="en" or appropriate language code to html element',
        wcagCriteria: '3.1.1 - Language of Page'
      });
    }

    return issues;
  }

  private static calculateScore(issues: AuditIssue[]): number {
    const errorWeight = 20;
    const warningWeight = 5;
    const infoWeight = 1;

    const errors = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;
    const infos = issues.filter(i => i.severity === 'info').length;

    const penalty = (errors * errorWeight) + (warnings * warningWeight) + (infos * infoWeight);
    const score = Math.max(0, 100 - penalty);

    return score;
  }

  static async generateReport(
    projectPath: string,
    outputFormat: 'text' | 'json' | 'html'
  ): Promise<string> {
    const result = await this.runAudit(projectPath);

    switch (outputFormat) {
      case 'json':
        return JSON.stringify(result, null, 2);
      
      case 'html':
        return this.generateHtmlReport(result);
      
      case 'text':
      default:
        return this.generateTextReport(result);
    }
  }

  private static generateHtmlReport(result: AuditResult): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Accessibility Audit Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    .score { font-size: 3rem; font-weight: bold; }
    .passed { color: #22c55e; }
    .failed { color: #ef4444; }
    .issue { padding: 1rem; margin: 0.5rem 0; border-radius: 8px; }
    .error { background: #fef2f2; border: 1px solid #ef4444; }
    .warning { background: #fffbeb; border: 1px solid #f59e0b; }
    .info { background: #f0f9ff; border: 1px solid #3b82f6; }
  </style>
</head>
<body>
  <h1>Accessibility Audit Report</h1>
  <p>Generated: ${result.checkedAt}</p>
  <p>Files checked: ${result.filesChecked}</p>
  <p class="score ${result.passed ? 'passed' : 'failed'}">Score: ${result.score}/100</p>
  <p>${result.passed ? '✓ All checks passed!' : `✗ ${result.issues.length} issues found`}</p>
  ${result.issues.map(issue => `
    <div class="issue ${issue.severity}">
      <h3>${issue.title}</h3>
      <p>${issue.description}</p>
      <p><strong>File:</strong> ${issue.file}</p>
      ${issue.suggestion ? `<p><strong>Fix:</strong> ${issue.suggestion}</p>` : ''}
      ${issue.wcagCriteria ? `<p><strong>WCAG:</strong> ${issue.wcagCriteria}</p>` : ''}
    </div>
  `).join('')}
</body>
</html>`;
  }

  private static generateTextReport(result: AuditResult): string {
    let report = '═══════════════════════════════════════\n';
    report += '       Accessibility Audit Report\n';
    report += '═══════════════════════════════════════\n\n';
    report += `Score: ${result.score}/100\n`;
    report += `Files checked: ${result.filesChecked}\n`;
    report += `Status: ${result.passed ? 'PASSED' : 'FAILED'}\n\n`;

    if (result.issues.length > 0) {
      report += 'Issues:\n';
      report += '───────────────────────────────────────\n';
      
      for (const issue of result.issues) {
        const icon = issue.severity === 'error' ? '✗' : issue.severity === 'warning' ? '!' : '•';
        report += `\n${icon} ${issue.title}\n`;
        report += `  ${issue.description}\n`;
        report += `  File: ${issue.file}\n`;
        if (issue.suggestion) report += `  Fix: ${issue.suggestion}\n`;
        if (issue.wcagCriteria) report += `  WCAG: ${issue.wcagCriteria}\n`;
      }
    }

    return report;
  }

  static getWcagRules() {
    return wcagRules;
  }
}

export const auditTool = AuditTool;
