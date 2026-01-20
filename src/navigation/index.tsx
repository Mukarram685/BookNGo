import React, { use } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import { useSelector } from 'react-redux';

const RootNavigator = () => {

  const token = useSelector((state: any) => state.auth.token);
  console.log("Auth Token:", token);
  
  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
