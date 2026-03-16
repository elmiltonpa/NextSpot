import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nextspot.vercel.app';

  const staticRoutes = [
    '',
    '/login',
    '/register',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let userRoutes: MetadataRoute.Sitemap = [];
  try {
    const users = await prisma.user.findMany({
      select: { username: true, updatedAt: true },
      take: 1000,
    });

    userRoutes = users
      .filter(user => user.username)
      .map((user) => ({
        url: `${baseUrl}/${user.username}`,
        lastModified: user.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }));
  } catch (error) {
    console.error('Error fetching users for sitemap:', error);
  }

  return [...staticRoutes, ...userRoutes];
}
