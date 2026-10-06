import { siteConfig } from '@/config/site';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Signed-in pages only hold private group data
      disallow: ['/dashboard', '/groups/', '/settings', '/invite/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
