// src/contexts/LibraryContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import RNFS from 'react-native-fs';

type Book = {
  id: number;
  bookId: number;
  title: string;
  cover: string;
  coverAlt: string;
  category: string;
  author: string;
  publisher?: string;
  publishedAt?: string;
  createdAt?: string;
  dtype: 'PUBLISHED' | 'REGISTERED';
  filePath: string;
  downloadDate: string;
  myTtsFlag: boolean;
  currentCfi: string;
  progressRate: number;
};

type LibraryContextType = {
  allBooks: Book[];
  setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addBook: (newBook: Book) => void;
  removeBook: (bookId: number) => Promise<void>; // 삭제 함수
};

export const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  const addBook = (newBook: Book) => {
    setAllBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const removeBook = async (bookId: number) => {
    const updatedBooks = allBooks.filter((book) => book.bookId !== bookId);
    setAllBooks(updatedBooks);

    try {
      const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
      const bookToDelete = allBooks.find((book) => book.bookId === bookId);

      if (bookToDelete) {
        // 파일 삭제
        await RNFS.unlink(bookToDelete.filePath);

        // JSON 파일 업데이트
        await RNFS.writeFile(dbPath, JSON.stringify(updatedBooks, null, 2), 'utf8');
      }
    } catch (error) {
      console.error('책 삭제 중 오류 발생:', error);
    }
  };

  return (
    <LibraryContext.Provider value={{ allBooks, setAllBooks, addBook, removeBook }}>
      {children}
    </LibraryContext.Provider>
  );
};
