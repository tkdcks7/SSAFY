// src/contexts/LibraryContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

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
  addBook: (newBook: Book) => void; // 새 도서 추가 메서드
};

export const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  // 새 도서를 추가하는 함수
  const addBook = (newBook: Book) => {
    setAllBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <LibraryContext.Provider value={{ allBooks, setAllBooks, addBook }}>
      {children}
    </LibraryContext.Provider>
  );
};
