import type { MetadataRoute } from 'next';

const siteUrl = 'https://8648567jfhgfgj-hwa-hackathon.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
