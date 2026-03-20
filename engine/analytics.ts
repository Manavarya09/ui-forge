import { writeFile, readFile, ensureDir } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs/promises';

export interface AnalyticsConfig {
  provider: 'plausible' | 'umami' | 'google' | 'none';
  trackingId?: string;
  domain?: string;
  apiKey?: string;
}

export interface AnalyticsScript {
  src?: string;
  content?: string;
  attrs?: Record<string, string>;
}

const analyticsScripts: Record<string, AnalyticsScript> = {
  plausible: {
    src: 'https://plausible.io/js/script.js',
    attrs: { defer: 'true', 'data-domain': '' }
  },
  umami: {
    src: 'https://analytics.umami.is/script.js',
    attrs: { defer: 'true', 'data-website-id': '' }
  },
  google: {
    src: 'https://www.googletagmanager.com/gtag/js',
    attrs: { id: 'GTM-XXXXXX' }
  }
};

export class AnalyticsManager {
  static async setup(
    projectPath: string,
    provider: string,
    trackingId?: string
  ): Promise<void> {
    const analyticsDir = path.join(projectPath, 'components', 'analytics');
    await ensureDir(analyticsDir);

    if (provider === 'none') {
      await this.remove(projectPath);
      return;
    }

    const scriptConfig = analyticsScripts[provider];
    if (!scriptConfig) {
      throw new Error(`Unsupported analytics provider: ${provider}`);
    }

    await writeFile(
      path.join(analyticsDir, 'index.tsx'),
      this.generateAnalyticsComponent(provider, trackingId)
    );

    await writeFile(
      path.join(analyticsDir, 'useAnalytics.ts'),
      this.generateUseAnalyticsHook(provider, trackingId)
    );

    await this.updateLayout(projectPath, provider);

    await this.updatePackageJson(projectPath, provider);

    logger.success(`Analytics (${provider}) configured successfully`);
  }

  static async remove(projectPath: string): Promise<void> {
    const analyticsDir = path.join(projectPath, 'components', 'analytics');
    
    try {
      await fs.rm(analyticsDir, { recursive: true });
      logger.success('Analytics removed');
    } catch {
      logger.info('No analytics to remove');
    }
  }

  static async getConfig(projectPath: string): Promise<AnalyticsConfig | null> {
    const configPath = path.join(projectPath, 'uiforge.config.json');
    
    try {
      const content = await readFile(configPath);
      const config = JSON.parse(content);
      return config.analytics || null;
    } catch {
      return null;
    }
  }

  private static generateAnalyticsComponent(
    provider: string,
    trackingId?: string
  ): string {
    return `'use client';

import { useEffect } from 'react';

interface AnalyticsProps {
  trackingId?: string;
  domain?: string;
}

export function Analytics({ trackingId, domain }: AnalyticsProps) {
  useEffect(() => {
    // Analytics component - configured for ${provider}
    // Tracking ID: ${trackingId || 'Not configured'}
  }, [trackingId, domain]);

  return null;
}

export default Analytics;
`;
  }

  private static generateUseAnalyticsHook(
    provider: string,
    trackingId?: string
  ): string {
    return `'use client';

interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

export function useAnalytics() {
  const trackEvent = (event: AnalyticsEvent) => {
    // Track event for ${provider}
    console.log('[Analytics]', event);
    
    // Provider-specific implementation
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  };

  const trackPageView = (url: string, title?: string) => {
    // Track page view for ${provider}
    console.log('[Analytics] Page view:', url, title);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', '${trackingId || ''}', {
        page_path: url,
        page_title: title,
      });
    }
  };

  const setUserProperty = (name: string, value: string) => {
    console.log('[Analytics] User property:', name, value);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('set', { [name]: value });
    }
  };

  return {
    trackEvent,
    trackPageView,
    setUserProperty,
  };
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (...args: any[]) => void;
  }
}
`;
  }

  private static async updateLayout(
    projectPath: string,
    provider: string
  ): Promise<void> {
    const layoutPath = path.join(projectPath, 'app', 'layout.tsx');
    
    try {
      let layoutContent = await readFile(layoutPath);
      
      if (!layoutContent.includes('Analytics')) {
        const analyticsImport = `import { Analytics } from '@/components/analytics';`;
        
        if (layoutContent.includes("import './globals.css'")) {
          layoutContent = layoutContent.replace(
            "import './globals.css'",
            "import './globals.css'\n" + analyticsImport
          );
        } else {
          layoutContent = analyticsImport + '\n' + layoutContent;
        }
        
        if (layoutContent.includes('</body>')) {
          layoutContent = layoutContent.replace(
            '</body>',
            '<Analytics />\n</body>'
          );
        }
        
        await writeFile(layoutPath, layoutContent);
      }
    } catch (error) {
      console.warn('Could not update layout.tsx:', error);
    }
  }

  private static async updatePackageJson(
    projectPath: string,
    provider: string
  ): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    try {
      const content = await readFile(packageJsonPath);
      const pkg = JSON.parse(content);
      
      if (!pkg.dependencies) pkg.dependencies = {};
      
      switch (provider) {
        case 'plausible':
          pkg.dependencies['react-plausible'] = '^2.1.0';
          break;
        case 'google':
          // No npm package needed for GA4
          break;
        // umami doesn't require npm package
      }
      
      await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
    } catch (error) {
      console.warn('Could not update package.json:', error);
    }
  }
}

export const analyticsManager = AnalyticsManager;
