'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Toaster } from 'react-hot-toast';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Loader from '@/components/Loader/Loader';
import EmptyState from '@/components/EmptyState/EmptyState';
import css from './NotesPage.module.css';

const SEARCH_DEBOUNCE_DELAY = 300;

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', currentPage, searchQuery],
    queryFn: () => fetchNotes({ page: currentPage, search: searchQuery }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    // a failed request is shown by the route error boundary (app/notes/error.tsx)
    throwOnError: true,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (totalPages > 0 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    updateSearchQuery(value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button type="button" className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isSuccess && notes.length === 0 && (
        <EmptyState
          message={
            searchQuery
              ? `No notes found for "${searchQuery}".`
              : 'You have no notes yet. Create your first one!'
          }
        />
      )}
      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </main>
  );
}
