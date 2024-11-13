import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import ReadingNotesPage from '../pages/ReadingNotesPage';
import LibraryPage from '../pages/Main/LibraryPage';
import SearchPage from '../pages/Main/SearchPage';
import RegisterBookPage from '../pages/Main/RegisterBookPage';
import MyPage from '../pages/Main/MyPage';
import SignupPage from '../pages/SignupPage';
import UserInfoPage from '../pages/MyPage/UserInfoPage';
import PasswordEditPage from '../pages/MyPage/PasswordEditPage';
import GeneralInfoEditPage from '../pages/MyPage/GeneralInfoEditPage';
import MyReviewPage from '../pages/MyPage/MyReviewPage';
import MyReviewEditPage from '../pages/MyPage/MyReviewEditPage';
import MyBooksPage from '../pages/MyPage/MyBooksPage';
import MyLikedBooksPage from '../pages/MyPage/MyLikedBooksPage';
import EBookViewerPage from '../pages/Ebook/EBookViewerPage';
import BookDetailPage from '../pages/BookDetail/BookDetailPage';
import ReviewPage from '../pages/BookDetail/ReviewPage';
import ImageUploadPage from '../pages/RegisterBook/ImageUploadPage';
import UploadGuidePage from '../pages/RegisterBook/UploadGuidePage';

import ViewDatabase from '../pages/DatabaseViewer'; // ViewDatabase 컴포넌트 추가

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  ReadingNotes: undefined;
  Library: undefined;
  Search: undefined;
  RegisterBook: undefined;
  ImageUpload: undefined;
  UploadGuide: undefined;
  MyPage: undefined;
  UserInfo: undefined;
  PasswordEdit: undefined;
  GeneralInfoEdit: { nickname: string; birth: string; blindFlag: boolean };
  MyReview: undefined;
  MyReviewEdit: {
    reviewId: number;
    title: string;
    content: string;
    score: number;
    updatedAt: string;
  };
  MyBooks: undefined;
  MyLikedBooks: undefined;
  EBookViewer: { bookId: string };
  BookDetail: { bookId: number };
  Review: { bookId: number };
  DatabaseViewer: undefined; // ViewDatabase 경로 추가
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="ReadingNotes" component={ReadingNotesPage} />
        <Stack.Screen name="Library" component={LibraryPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="RegisterBook" component={RegisterBookPage} />
        <Stack.Screen name="ImageUpload" component={ImageUploadPage} />
        <Stack.Screen name="UploadGuide" component={UploadGuidePage} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="UserInfo" component={UserInfoPage} />
        <Stack.Screen name="PasswordEdit" component={PasswordEditPage} />
        <Stack.Screen name="GeneralInfoEdit" component={GeneralInfoEditPage} />
        <Stack.Screen name="MyReview" component={MyReviewPage} />
        <Stack.Screen name="MyReviewEdit" component={MyReviewEditPage} />
        <Stack.Screen name="MyBooks" component={MyBooksPage} />
        <Stack.Screen name="MyLikedBooks" component={MyLikedBooksPage} />
        <Stack.Screen name="EBookViewer" component={EBookViewerPage} />
        <Stack.Screen name="BookDetail" component={BookDetailPage} />
        <Stack.Screen name="Review" component={ReviewPage} />
        <Stack.Screen name="DatabaseViewer" component={ViewDatabase} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
