// src/data/dummyReview.ts
export const dummyMyReview = {
    reviewList: [
      {
        reviewId: 1,
        title: '1984',
        bookId: 3351,
        content: '전체주의의 최악성을 여실히 보여준 이 소설은 인류 역사에 깊이 남아야 합니다.',
        score: 4,
        updatedAt: '2024-10-02 14:00',
      },
      {
        reviewId: 2,
        title: '채식주의자',
        bookId: 3352,
        content: '기괴하고 인물들의 개연성이 부족했지만, 다른 자에 대해 가지게 되는 폭력이 어떻게 이뤄지는지 잘 묘사했습니다.',
        score: 3,
        updatedAt: '2024-10-01 10:20',
      },
      {
        reviewId: 3,
        title: '뇌물의 역사',
        bookId: 3353,
        content: '설명은 떠나 뇌물의 존재를 인정하고, 그 역사적인 흐름을 보여주는 책으로 추천드립니다.',
        score: 5,
        updatedAt: '2024-09-25 09:45',
      },
    ],
  };


export const dummyInitialReviewResponse = {
  reviewList: [
    {
      reviewId: 1,
      nickname: '회원1',
      content: '재미있어요',
      score: 4,
      updatedAt: '2024-10-14 15:33',
    },
    {
      reviewId: 2,
      nickname: '회원2',
      content: '아주 유익했어요',
      score: 5,
      updatedAt: '2024-10-13 12:20',
    },
  ],
  lastDateTime: '2024-11-03T17:03:00',
  lastId: 2,
  memberReview: {
    reviewId: 1,
    content: '전체주의의 최악성을 여실히 보여준 이 소설은 인류 역사에 깊이 남아야 합니다.',
    score: 4,
    updatedAt: '2024-10-14 15:33',
  },
};

export const dummyLoadMoreReviewResponse = {
  reviewList: [
    {
      reviewId: 3,
      nickname: '회원3',
      content: '괜찮았어요',
      score: 3,
      updatedAt: '2024-10-12 09:15',
    },
    {
      reviewId: 4,
      nickname: '회원4',
      content: '다소 지루한 부분이 있었어요',
      score: 2,
      updatedAt: '2024-10-11 17:45',
    },
  ],
  lastDateTime: '2024-11-04T10:00:00',
  lastId: 4,
  memberReview: null,
};
