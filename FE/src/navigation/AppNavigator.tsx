// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import LibraryPage from '../pages/Main/LibraryPage';
import SearchPage from '../pages/Main/SearchPage';
import RegisterBookPage from '../pages/Main/RegisterBookPage';
import MyPage from '../pages/Main/MyPage';
import SignupPage from '../pages/SignupPage';
import EBookViewerPage from '../pages/Ebook/EBookViewerPage';


export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Library: undefined;
  Search: undefined;
  RegisterBook: undefined;
  MyPage: undefined;
  EBookViewer: { bookId: string };
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
        <Stack.Screen name="Library" component={LibraryPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="RegisterBook" component={RegisterBookPage} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="EBookViewer" component={EBookViewerPage} options={{ title: 'E-Book 뷰어' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
