// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../pages/HomePage';
import LibraryNavigator from '../navigation/LibraryNavigator';

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Search: undefined;
  RegisterBook: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Library" component={LibraryNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
