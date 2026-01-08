import { getAdminDb } from '@/server/firebase-admin';
import { shouldUseRemoteContent } from '@/server/remote-config';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  icon?: string;
  heroImage?: string;
  slug: string;
}

const ICON_MAP: Record<string, string> = {
  intelligence: 'BrainCircuit',
  productivity: 'Zap',
  marketing: 'Activity',
};

export async function fetchBlogPosts(limit = 6): Promise<BlogPost[]> {
  try {
    if (!shouldUseRemoteContent) {
      return [];
    }
    const db = getAdminDb();
    const snapshot = await db
      .collection('content_posts')
      .orderBy('publishedAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        title: data.title,
        excerpt: data.excerpt,
        author: data.author,
        date: data.publishedAt,
        category: data.category,
        icon: data.icon || ICON_MAP[data.category?.toLowerCase()] || 'Sparkles',
        heroImage: data.heroImage,
        slug: data.slug || doc.id,
      } satisfies BlogPost;
    });
  } catch (error) {
    console.error('[fetchBlogPosts] Failed to load content_posts', error);
    return [];
  }
}
