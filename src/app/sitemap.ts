import { siteConfig } from '@/config/site';
import paths from '@/lib/paths';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${siteConfig.url}${path === '/' ? '' : path}`,
    changeFrequency: 'monthly',
    priority,
  });

  return [
    page(paths.home(), 1),
    page(paths.getStarted(), 0.8),
    page('/terms', 0.3),
    page('/privacy', 0.3),
  ];
}
