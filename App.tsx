import './src/i18n/i18n';
import React, {  useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import store from './src/store/store';
import Test from './src/screens/main/Test';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);



  return (
    <Provider store={store }>
      <Test/>
    </Provider>
  );
};

export default App;
