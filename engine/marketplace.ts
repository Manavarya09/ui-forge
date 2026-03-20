import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

export interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  author: string;
  authorUrl?: string;
  thumbnail?: string;
  tags: string[];
  featured: boolean;
  downloads: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  components?: string[];
  style?: string;
}

const builtinTemplates: MarketplaceTemplate[] = [
  {
    id: 'dashboard-pro',
    name: 'Dashboard Pro',
    description: 'Advanced admin dashboard with charts, tables, and analytics widgets',
    author: 'uiforge',
    thumbnail: 'https://picsum.photos/seed/dashboard/400/300',
    tags: ['dashboard', 'admin', 'analytics', 'charts'],
    featured: true,
    downloads: 15420,
    rating: 4.8,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    components: ['sidebar', 'header', 'metrics', 'charts', 'table'],
    style: 'enterprise'
  },
  {
    id: 'landing-startup',
    name: 'Startup Landing',
    description: 'Modern landing page with animations, pricing, and testimonials',
    author: 'uiforge',
    thumbnail: 'https://picsum.photos/seed/startup/400/300',
    tags: ['landing', 'startup', 'saas', 'marketing'],
    featured: true,
    downloads: 23150,
    rating: 4.9,
    createdAt: '2024-01-20',
    updatedAt: '2024-03-15',
    components: ['hero', 'features', 'pricing', 'testimonials', 'cta'],
    style: 'minimal'
  },
  {
    id: 'ecommerce-fashion',
    name: 'Fashion Store',
    description: 'E-commerce template for fashion brands with product galleries',
    author: 'fashionstudio',
    authorUrl: 'https://github.com/fashionstudio',
    thumbnail: 'https://picsum.photos/seed/fashion/400/300',
    tags: ['ecommerce', 'fashion', 'store', 'products'],
    featured: false,
    downloads: 8920,
    rating: 4.5,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-05',
    components: ['hero', 'products', 'categories', 'cart', 'checkout'],
    style: 'flat'
  },
  {
    id: 'blog-minimal',
    name: 'Minimal Blog',
    description: 'Clean, minimalist blog template with dark mode support',
    author: 'devblogger',
    authorUrl: 'https://github.com/devblogger',
    thumbnail: 'https://picsum.photos/seed/blog/400/300',
    tags: ['blog', 'minimal', 'writing', 'content'],
    featured: false,
    downloads: 12400,
    rating: 4.7,
    createdAt: '2024-02-10',
    updatedAt: '2024-03-12',
    components: ['header', 'posts', 'sidebar', 'footer'],
    style: 'dark-minimal'
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'Portfolio with 3D elements, smooth animations, and case studies',
    author: 'creativestudio',
    authorUrl: 'https://github.com/creativestudio',
    thumbnail: 'https://picsum.photos/seed/portfolio/400/300',
    tags: ['portfolio', 'creative', '3d', 'animation'],
    featured: true,
    downloads: 18760,
    rating: 4.9,
    createdAt: '2024-02-15',
    updatedAt: '2024-03-18',
    components: ['hero', 'projects', 'about', 'contact', 'testimonials'],
    style: 'tech-futurism'
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'SaaS metrics dashboard with MRR tracking and user analytics',
    author: 'saasbuild',
    authorUrl: 'https://github.com/saasbuild',
    thumbnail: 'https://picsum.photos/seed/saas/400/300',
    tags: ['saas', 'dashboard', 'metrics', 'analytics'],
    featured: false,
    downloads: 11230,
    rating: 4.6,
    createdAt: '2024-02-20',
    updatedAt: '2024-03-08',
    components: ['header', 'metrics', 'charts', 'users', 'activity'],
    style: 'glass'
  },
  {
    id: 'agency-modern',
    name: 'Modern Agency',
    description: 'Agency website with services, portfolio, and team sections',
    author: 'uiforge',
    thumbnail: 'https://picsum.photos/seed/agency/400/300',
    tags: ['agency', 'business', 'portfolio', 'services'],
    featured: false,
    downloads: 7650,
    rating: 4.4,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    components: ['hero', 'services', 'portfolio', 'team', 'contact'],
    style: 'bento'
  },
  {
    id: 'fitness-gym',
    name: 'Fitness & Gym',
    description: 'Gym and fitness center template with class schedules',
    author: 'fitlife',
    authorUrl: 'https://github.com/fitlife',
    thumbnail: 'https://picsum.photos/seed/fitness/400/300',
    tags: ['fitness', 'gym', 'health', 'schedule'],
    featured: false,
    downloads: 5430,
    rating: 4.3,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-14',
    components: ['hero', 'programs', 'schedule', 'trainers', 'pricing'],
    style: 'brutalism'
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Restaurant website with menu, reservations, and gallery',
    author: 'foodlover',
    authorUrl: 'https://github.com/foodlover',
    thumbnail: 'https://picsum.photos/seed/restaurant/400/300',
    tags: ['restaurant', 'food', 'menu', 'reservation'],
    featured: false,
    downloads: 6780,
    rating: 4.5,
    createdAt: '2024-03-08',
    updatedAt: '2024-03-16',
    components: ['hero', 'menu', 'gallery', 'reservation', 'footer'],
    style: 'swiss'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Property listing website with search and map integration',
    author: 'propertypro',
    authorUrl: 'https://github.com/propertypro',
    thumbnail: 'https://picsum.photos/seed/realestate/400/300',
    tags: ['real-estate', 'property', 'listing', 'search'],
    featured: false,
    downloads: 8900,
    rating: 4.6,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-17',
    components: ['hero', 'search', 'listings', 'map', 'agent'],
    style: 'material'
  }
];

export class Marketplace {
  private templates: MarketplaceTemplate[] = builtinTemplates;
  private installed: Set<string> = new Set();

  async list(): Promise<MarketplaceTemplate[]> {
    await this.simulateNetworkDelay();
    return this.templates.sort((a, b) => b.downloads - a.downloads);
  }

  async featured(): Promise<MarketplaceTemplate[]> {
    await this.simulateNetworkDelay();
    return this.templates.filter(t => t.featured);
  }

  async search(query: string): Promise<MarketplaceTemplate[]> {
    await this.simulateNetworkDelay();
    const q = query.toLowerCase();
    return this.templates.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q))
    );
  }

  async get(id: string): Promise<MarketplaceTemplate | undefined> {
    await this.simulateNetworkDelay();
    return this.templates.find(t => t.id === id);
  }

  async install(templateId: string): Promise<void> {
    const template = await this.get(templateId);
    if (!template) {
      throw new Error(`Template "${templateId}" not found in marketplace`);
    }

    await this.simulateNetworkDelay();

    if (this.installed.has(templateId)) {
      logger.info(`Template "${template.name}" is already installed`);
      return;
    }

    this.installed.add(templateId);
    logger.success(`Template "${template.name}" installed successfully`);
  }

  async uninstall(templateId: string): Promise<void> {
    if (!this.installed.has(templateId)) {
      throw new Error(`Template "${templateId}" is not installed`);
    }

    this.installed.delete(templateId);
    logger.success(`Template "${templateId}" uninstalled`);
  }

  async getInstalled(): Promise<MarketplaceTemplate[]> {
    return this.templates.filter(t => this.installed.has(t.id));
  }

  async rate(templateId: string, rating: number): Promise<void> {
    const template = await this.get(templateId);
    if (!template) {
      throw new Error(`Template "${templateId}" not found`);
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const currentTotal = template.rating * template.downloads;
    template.downloads += 1;
    template.rating = (currentTotal + rating) / template.downloads;

    logger.success(`Rated ${template.name} with ${rating} stars`);
  }

  async getByCategory(category: string): Promise<MarketplaceTemplate[]> {
    await this.simulateNetworkDelay();
    return this.templates.filter(t =>
      t.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
    );
  }

  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    this.templates.forEach(t => t.tags.forEach(tag => categories.add(tag)));
    return [...categories].sort();
  }

  async getTrending(): Promise<MarketplaceTemplate[]> {
    await this.simulateNetworkDelay();
    return this.templates
      .filter(t => t.downloads > 10000)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }

  async getNewest(): Promise<MarketplaceTemplate[]> {
    await this.simulateNetworkDelay();
    return [...this.templates]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  async submitTemplate(template: Omit<MarketplaceTemplate, 'id' | 'downloads' | 'rating' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = template.name.toLowerCase().replace(/\s+/g, '-');
    
    const newTemplate: MarketplaceTemplate = {
      ...template,
      id,
      downloads: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.push(newTemplate);
    logger.success(`Template "${template.name}" submitted for review`);

    return id;
  }

  async getStats(): Promise<{
    totalTemplates: number;
    totalDownloads: number;
    averageRating: number;
    categories: number;
  }> {
    const totalDownloads = this.templates.reduce((sum, t) => sum + t.downloads, 0);
    const averageRating = this.templates.reduce((sum, t) => sum + t.rating, 0) / this.templates.length;
    const categories = new Set(this.templates.flatMap(t => t.tags)).size;

    return {
      totalTemplates: this.templates.length,
      totalDownloads,
      averageRating,
      categories
    };
  }

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export const marketplace = new Marketplace();
