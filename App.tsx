import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { oneSignalAppId } from './src/config/env.config';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import RootNavigator from './src/navigation';
import './src/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60_000 },
  },
});

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(oneSignalAppId);
    OneSignal.Notifications.requestPermission(true);

    const clickHandler = (event: any) => console.log('Notif click:', event);
    const receiveHandler = (event: any) => console.log('Notif received:', event);
    OneSignal.Notifications.addEventListener('click', clickHandler);
    OneSignal.Notifications.addEventListener('received', receiveHandler);

    return () => {
      OneSignal.Notifications.removeEventListener('click', clickHandler);
      OneSignal.Notifications.removeEventListener('received', receiveHandler);
    };
  }, []);

  const onBeforeLift = () => {
    setTimeout(() => SplashScreen.hide(), 100);
  };

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={onBeforeLift}
      >
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
          <Toast />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
