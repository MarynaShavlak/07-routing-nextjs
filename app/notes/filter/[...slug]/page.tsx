import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/notes';
import { ALL_NOTES_FILTER, NOTE_TAGS } from '@/lib/constants';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

interface FilteredNotesProps {
  params: Promise<{ slug: string[] }>;
}

const isNoteTag = (value: string): value is NoteTag =>
  NOTE_TAGS.includes(value as NoteTag);

// "all" is not a tag on the backend, so it maps to a request without a tag
const getTagFromSlug = (slug: string[]): NoteTag | undefined => {
  const [filter] = slug;

  if (slug.length === 1 && filter === ALL_NOTES_FILTER) {
    return undefined;
  }

  if (slug.length === 1 && isNoteTag(filter)) {
    return filter;
  }

  notFound();
};

export default async function FilteredNotes({ params }: FilteredNotesProps) {
  const { slug } = await params;
  const tag = getTagFromSlug(slug);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag ?? ALL_NOTES_FILTER, 1, ''],
    queryFn: () => fetchNotes({ page: 1, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* the key resets the page and the search when another tag is selected */}
      <NotesClient key={tag ?? ALL_NOTES_FILTER} tag={tag} />
    </HydrationBoundary>
  );
}
