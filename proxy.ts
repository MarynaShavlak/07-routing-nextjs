import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTagFromSlug } from '@/lib/utils';

const FILTER_PATH = '/notes/filter/';

// The filter page streams its loading state first, so a notFound() call inside it
// can no longer change the response status. An unknown tag is checked here, before
// rendering, and rewritten to a path without a route: the not-found page is then
// served with a real 404 status.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname
    .slice(FILTER_PATH.length)
    .split('/')
    .filter(Boolean);

  if (getTagFromSlug(slug) === null) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/notes/filter/:path+',
};
