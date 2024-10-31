export const dummyBooks = [
  { id: 1, title: '1984', author: '조지 오웰', downloadDate: '2023-10-01', category: '소설', type: '출판도서', coverImage: require('../assets/images/books/book1.png'), publisher: '민음사' },
  { id: 2, title: '멋진 신세계', author: '올더스 헉슬리', downloadDate: '2023-09-20', category: '소설', type: '출판도서', coverImage: require('../assets/images/books/book2.png'), publisher: '문학동네' },
  { id: 3, title: '동물 농장', author: '조지 오웰', downloadDate: '2023-08-15', category: '소설', type: '출판도서', coverImage: require('../assets/images/books/book3.png'), publisher: '열린책들' },
  { id: 4, title: '앤디 위어 - 헤일 메리', author: '앤디 위어', downloadDate: '2023-07-30', category: 'SF', type: '등록도서', coverImage: require('../assets/images/books/book4.png'), publisher: 'RHK' },
  { id: 5, title: '채식주의자', author: '한강', downloadDate: '2023-06-10', category: '문학', type: '등록도서', coverImage: require('../assets/images/books/book5.png'), publisher: '창비' },
  { id: 6, title: '연금술사', author: '파울로 코엘료', downloadDate: '2023-05-05', category: '자기계발', type: '출판도서', coverImage: require('../assets/images/books/book6.png'), publisher: '문학동네' },
  { id: 7, title: '도둑맞은 집중력', author: '요한 하리', downloadDate: '2023-04-01', category: '심리학', type: '등록도서', coverImage: require('../assets/images/books/book7.png'), publisher: 'RHK' },
  { id: 8, title: '총, 균, 쇠', author: '재레드 다이아몬드', downloadDate: '2023-03-15', category: '역사', type: '출판도서', coverImage: require('../assets/images/books/book8.png'), publisher: '문학사상' },
  { id: 9, title: '거인의 노트', author: '팀 페리스', downloadDate: '2023-02-20', category: '자기계발', type: '등록도서', coverImage: require('../assets/images/books/book9.png'), publisher: '한빛비즈' },
];

export const currentBook = {
  id: 4,
  title: '앤디 위어 - 헤일 메리',
  author: '앤디 위어',
  downloadDate: '2023-07-30',
  category: 'SF',
  type: '등록도서',
  coverImage: require('../assets/images/books/book4.png'),
  progress: 45, // 진행도 (% 표시)
  publisher: 'RHK',
};

export const myBooks = [
  {
    bookId: 1,
    title: '1984',
    author: '조지 오웰',
    cover: require('../assets/images/books/book1.png'),
    dtype: 'PUBLISHED',
  },
  {
    bookId: 2,
    title: '멋진 신세계',
    author: '올더스 헉슬리',
    cover: require('../assets/images/books/book2.png'),
    dtype: 'PUBLISHED',
  },
  {
    bookId: 3,
    title: '동물 농장',
    author: '조지 오웰',
    cover: require('../assets/images/books/book3.png'),
    dtype: 'PUBLISHED',
  },
  {
    bookId: 4,
    title: '앤디 위어 - 헤일 메리',
    author: '앤디 위어',
    cover: require('../assets/images/books/book4.png'),
    dtype: 'PUBLISHED',
  },
  {
    bookId: 5,
    title: '채식주의자',
    author: '한강',
    cover: require('../assets/images/books/book5.png'),
    dtype: 'PUBLISHED',
  },
  {
    bookId: 6,
    title: '연금술사',
    author: '파울로 코엘료',
    cover: require('../assets/images/books/book6.png'),
    dtype: 'PUBLISHED',
  },
  {
    bookId: 7,
    title: '도둑맞은 집중력',
    author: '요한 하리',
    cover: require('../assets/images/books/book7.png'),
    dtype: 'REGISTERED',
  },
  {
    bookId: 8,
    title: '총, 균, 쇠',
    author: '재레드 다이아몬드',
    cover: require('../assets/images/books/book8.png'),
    dtype: 'PUBLISHED',
  },
  {
    bookId: 9,
    title: '거인의 노트',
    author: '팀 페리스',
    cover: require('../assets/images/books/book9.png'),
    dtype: 'REGISTERED',
  },
];
