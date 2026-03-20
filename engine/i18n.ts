import { writeFile, ensureDir } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs/promises';

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const supportedLocales: Locale[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr' },
];

export interface TranslationKey {
  key: string;
  defaultValue: string;
  description?: string;
}

export const commonTranslations: TranslationKey[] = [
  { key: 'common.home', defaultValue: 'Home', description: 'Home page link' },
  { key: 'common.about', defaultValue: 'About', description: 'About page link' },
  { key: 'common.contact', defaultValue: 'Contact', description: 'Contact page link' },
  { key: 'common.blog', defaultValue: 'Blog', description: 'Blog page link' },
  { key: 'common.pricing', defaultValue: 'Pricing', description: 'Pricing page link' },
  { key: 'common.features', defaultValue: 'Features', description: 'Features section title' },
  { key: 'common.getStarted', defaultValue: 'Get Started', description: 'CTA button text' },
  { key: 'common.learnMore', defaultValue: 'Learn More', description: 'Secondary CTA' },
  { key: 'common.signUp', defaultValue: 'Sign Up', description: 'Sign up button' },
  { key: 'common.signIn', defaultValue: 'Sign In', description: 'Sign in button' },
  { key: 'common.logout', defaultValue: 'Log Out', description: 'Logout button' },
  { key: 'common.search', defaultValue: 'Search', description: 'Search placeholder' },
  { key: 'common.menu', defaultValue: 'Menu', description: 'Menu button' },
  { key: 'common.close', defaultValue: 'Close', description: 'Close button' },
  { key: 'common.back', defaultValue: 'Back', description: 'Back button' },
  { key: 'common.next', defaultValue: 'Next', description: 'Next button' },
  { key: 'common.previous', defaultValue: 'Previous', description: 'Previous button' },
  { key: 'common.submit', defaultValue: 'Submit', description: 'Submit button' },
  { key: 'common.cancel', defaultValue: 'Cancel', description: 'Cancel button' },
  { key: 'common.save', defaultValue: 'Save', description: 'Save button' },
  { key: 'common.delete', defaultValue: 'Delete', description: 'Delete button' },
  { key: 'common.edit', defaultValue: 'Edit', description: 'Edit button' },
  { key: 'common.loading', defaultValue: 'Loading...', description: 'Loading indicator' },
  { key: 'common.error', defaultValue: 'Error', description: 'Error message title' },
  { key: 'common.success', defaultValue: 'Success', description: 'Success message title' },
  { key: 'common.notFound', defaultValue: 'Not Found', description: '404 page title' },
  { key: 'hero.title', defaultValue: 'Build Amazing Products', description: 'Hero section title' },
  { key: 'hero.subtitle', defaultValue: 'The all-in-one platform for building, launching, and scaling your products.', description: 'Hero section subtitle' },
  { key: 'hero.cta', defaultValue: 'Start Building Today', description: 'Hero CTA button' },
  { key: 'hero.secondaryCta', defaultValue: 'Watch Demo', description: 'Hero secondary CTA' },
  { key: 'features.title', defaultValue: 'Features', description: 'Features section title' },
  { key: 'pricing.title', defaultValue: 'Simple, Transparent Pricing', description: 'Pricing section title' },
  { key: 'pricing.monthly', defaultValue: 'Monthly', description: 'Monthly billing label' },
  { key: 'pricing.yearly', defaultValue: 'Yearly', description: 'Yearly billing label' },
  { key: 'footer.privacy', defaultValue: 'Privacy Policy', description: 'Privacy policy link' },
  { key: 'footer.terms', defaultValue: 'Terms of Service', description: 'Terms of service link' },
  { key: 'footer.copyright', defaultValue: 'All rights reserved.', description: 'Copyright suffix' },
];

export class i18nGenerator {
  static async setup(projectPath: string, defaultLocale: string = 'en'): Promise<void> {
    const i18nDir = path.join(projectPath, 'i18n');
    const localesDir = path.join(i18nDir, 'locales');

    await ensureDir(localesDir);

    await writeFile(
      path.join(projectPath, 'i18n.config.ts'),
      this.generateI18nConfig(defaultLocale)
    );

    await writeFile(
      path.join(localesDir, `${defaultLocale}.json`),
      this.generateLocaleFile(defaultLocale)
    );

    await writeFile(
      path.join(i18nDir, 'useTranslation.ts'),
      this.generateUseTranslationHook()
    );

    await writeFile(
      path.join(i18nDir, 'index.ts'),
      `export { useTranslation } from './useTranslation';
export { i18nConfig, defaultLocale, locales } from './i18n.config';
`
    );

    logger.success('Internationalization setup complete');
  }

  static async addLocale(projectPath: string, localeCode: string): Promise<void> {
    const locale = supportedLocales.find(l => l.code === localeCode);
    if (!locale) {
      throw new Error(`Locale "${localeCode}" is not supported`);
    }

    const localesDir = path.join(projectPath, 'i18n', 'locales');
    await ensureDir(localesDir);

    await writeFile(
      path.join(localesDir, `${localeCode}.json`),
      this.generateLocaleFile(localeCode)
    );

    logger.success(`Locale "${locale.name}" (${localeCode}) added`);
  }

  static async extractTranslations(projectPath: string): Promise<void> {
    const keys = [...commonTranslations];
    const outputPath = path.join(projectPath, 'i18n', 'extracted-keys.json');
    
    await writeFile(outputPath, JSON.stringify(keys, null, 2));
    
    logger.success(`Extracted ${keys.length} translation keys`);
  }

  private static generateI18nConfig(defaultLocale: string): string {
    return `import { locales } from './i18n.config';

export const i18nConfig = {
  defaultLocale: '${defaultLocale}',
  locales,
  localeDetection: true,
  localePrefix: 'as-needed' as const,
};

export default i18nConfig;
`;
  }

  private static generateLocaleFile(localeCode: string): string {
    const translations: Record<string, string> = {};
    
    for (const key of commonTranslations) {
      translations[key.key] = key.defaultValue;
    }

    if (localeCode === 'es') {
      translations['common.home'] = 'Inicio';
      translations['common.about'] = 'Acerca de';
      translations['common.contact'] = 'Contacto';
      translations['common.features'] = 'Características';
      translations['common.pricing'] = 'Precios';
      translations['hero.title'] = 'Construye Productos Increíbles';
    } else if (localeCode === 'fr') {
      translations['common.home'] = 'Accueil';
      translations['common.about'] = 'À propos';
      translations['common.contact'] = 'Contact';
      translations['common.features'] = 'Fonctionnalités';
      translations['common.pricing'] = 'Tarifs';
      translations['hero.title'] = 'Construisez des Produits Incroyables';
    } else if (localeCode === 'de') {
      translations['common.home'] = 'Startseite';
      translations['common.about'] = 'Über uns';
      translations['common.contact'] = 'Kontakt';
      translations['common.features'] = 'Funktionen';
      translations['common.pricing'] = 'Preise';
      translations['hero.title'] = 'Erstaunliche Produkte entwickeln';
    } else if (localeCode === 'ja') {
      translations['common.home'] = 'ホーム';
      translations['common.about'] = '会社概要';
      translations['common.contact'] = 'お問い合わせ';
      translations['common.features'] = '機能';
      translations['common.pricing'] = '料金';
      translations['hero.title'] = '素晴らしいプロダクトを作る';
    } else if (localeCode === 'zh') {
      translations['common.home'] = '首页';
      translations['common.about'] = '关于我们';
      translations['common.contact'] = '联系我们';
      translations['common.features'] = '功能特点';
      translations['common.pricing'] = '价格';
      translations['hero.title'] = '构建出色的产品';
    }

    return JSON.stringify(translations, null, 2);
  }

  private static generateUseTranslationHook(): string {
    return `'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { i18nConfig, locales } from './i18n.config';

type TranslationKey = string;

interface TranslationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children, locale: initialLocale }: { children: ReactNode; locale?: string }) {
  const [locale, setLocale] = useState(initialLocale || i18nConfig.defaultLocale);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    async function loadTranslations() {
      try {
        const localeData = await import(\`./locales/\${locale}.json\`).catch(() => {
          return import(\`./locales/\${i18nConfig.defaultLocale}.json\`);
        });
        setTranslations(localeData.default || localeData);
        
        const localeInfo = locales.find(l => l.code === locale);
        setDir(localeInfo?.direction || 'ltr');
      } catch {
        console.warn(\`Failed to load translations for locale: \${locale}\`);
      }
    }
    
    loadTranslations();
  }, [locale]);

  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export { locales };
`;
  }
}
