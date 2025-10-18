import './src/i18n/i18n';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import  {store, persistor } from './src/store/store';
import Test from './src/screens/main/Test';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <Test />
      </PersistGate>

    </Provider>
  );
};

export default App;
