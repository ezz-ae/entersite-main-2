import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const placeholderImages = [
    {
      "id": "user-avatar",
      "description": "Default user avatar",
      "imageUrl": "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      "width": 150,
      "height": 150,
      "imageHint": "person portrait"
    },
    {
      "id": "user-avatar-1",
      "description": "Testimonial user 1",
      "imageUrl": "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      "width": 150,
      "height": 150,
      "imageHint": "woman portrait"
    },
    {
      "id": "user-avatar-2",
      "description": "Testimonial user 2",
      "imageUrl": "https://i.pravatar.cc/150?u=a04258114e29026702d",
      "width": 150,
      "height": 150,
      "imageHint": "man portrait"
    },
    {
      "id": "user-avatar-3",
      "description": "Testimonial user 3",
      "imageUrl": "https://i.pravatar.cc/150?u=a042581f4e29026707d",
      "width": 150,
      "height": 150,
      "imageHint": "person smiling"
    },
    {
      "id": "user-avatar-4",
      "description": "Author avatar",
      "imageUrl": "https://github.com/shadcn.png",
      "width": 40,
      "height": 40,
      "imageHint": "person avatar"
    },
    {
      "id": "blog-cover-1",
      "description": "Blog cover for PropTech article",
      "imageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=675",
      "width": 1200,
      "height": 675,
      "imageHint": "future technology"
    },
    {
      "id": "blog-cover-2",
      "description": "Blog cover for landing page article",
      "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=450",
      "width": 800,
      "height": 450,
      "imageHint": "analytics dashboard"
    },
    {
      "id": "blog-cover-3",
      "description": "Blog cover for SEO article",
      "imageUrl": "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=800&h=450",
      "width": 800,
      "height": 450,
      "imageHint": "team meeting"
    },
    {
      "id": "blog-cover-4",
      "description": "Blog cover for Google Ads article",
      "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=450",
      "width": 800,
      "height": 450,
      "imageHint": "charts graphs"
    },
    {
      "id": "logo-emaar",
      "description": "Emaar Properties Logo",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Emaar_Logo.svg",
      "width": 200,
      "height": 100,
      "imageHint": "company logo"
    }
  ]

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALL_ROLES);
    return NextResponse.json(placeholderImages);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
  }
}
