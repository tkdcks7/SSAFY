import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Book {
  bookId: number;
  title: string;
  cover: string;
  author: string;
  coverAlt?: string;
  publisher?: string
  dtype?: string;
  story?: string;
  filePath?: string;
}

interface EpubState {
  books: Book[];
  addBook: (book: Partial<Book> & { bookId: number, title: string, cover: string, author: string }) => void;
  removeBook: (bookId: number) => void;
  updateFilePath: (bookId: number, newFilePath: string) => void;
}

const useEpubStore = create<EpubState>()(
  persist(
    (set) => ({
      books: [],

      // 책을 배열에 추가 (일부 속성이 비어 있어도 추가 가능)
      addBook: (book) =>
        set((state) => ({
          books: [
            ...state.books,
            {
              bookId: book.bookId,
              title: book.title,
              cover: book.cover,
              author: book.author,
              coverAlt: book.coverAlt ?? '',
              publisher: book.publisher ?? '',
              dtype: book.dtype ?? '',
              story: book.story ?? '',
              filePath: book.filePath ?? '',
            },
          ],
        })),

      // bookId로 책을 제거
      removeBook: (bookId) =>
        set((state) => ({
          books: state.books.filter((book) => book.bookId !== bookId),
        })),

      // bookId로 파일 경로(filePath) 업데이트
      updateFilePath: (bookId, newFilePath) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.bookId === bookId ? { ...book, filePath: newFilePath } : book
          ),
        })),
    }),
    {
      name: 'epub-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useEpubStore;