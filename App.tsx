import './src/i18n/i18n';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store/store';
import Test from './src/screens/main/Test';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Test />
          <Toast />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
