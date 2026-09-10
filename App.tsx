import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider, useSelector } from 'react-redux';
import { store, persistor } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { oneSignalAppId, stripePublishableKey } from './src/config/env.config';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import RootNavigator from './src/navigation';
import './src/i18n/i18n';
import { StripeProvider } from '@stripe/stripe-react-native';

const OneSignalUserSync = () => {
  const user = useSelector((state: any) => state.auth?.user);

  useEffect(() => {
    const syncUser = async () => {
      const userId = user?._id || user?.id;
      console.log('[OneSignalUserSync] Redux Auth User Object:', JSON.stringify(user));
      
      if (userId) {
        const targetId = String(userId);
        console.log('[OneSignalUserSync] Logging in user to OneSignal:', targetId);
        OneSignal.login(targetId);

        // Fetch & log debugging info about OneSignal user & push subscription state
        setTimeout(async () => {
          try {
            const externalId = await OneSignal.User.getExternalId();
            const onesignalId = await OneSignal.User.getOnesignalId();
            const optedIn = await OneSignal.User.pushSubscription.getOptedInAsync();
            const pushToken = await OneSignal.User.pushSubscription.getTokenAsync();
            console.log('[OneSignalUserSync Debug] Current External ID:', externalId);
            console.log('[OneSignalUserSync Debug] OneSignal Player ID:', onesignalId);
            console.log('[OneSignalUserSync Debug] Push Opted In:', optedIn);
            console.log('[OneSignalUserSync Debug] Push Token:', pushToken);
          } catch (e) {
            console.error('[OneSignalUserSync Debug Error]:', e);
          }
        }, 1000);
      } else {
        if (typeof OneSignal.logout === 'function') {
          OneSignal.logout();
        } else if (OneSignal.User && typeof OneSignal.User.logout === 'function') {
          OneSignal.User.logout();
        }
      }
    };

    syncUser();
  }, [user]);

  return null;
};

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
    Promise.resolve(OneSignal.Notifications.requestPermission(true)).then((granted) => {
      console.log('[OneSignal] Push Notification Permission Result:', granted);
    }).catch(() => {});

    const clickHandler = (event: any) => {
      console.log('[OneSignal] Notification clicked:', JSON.stringify(event));
    };

    const foregroundHandler = (event: any) => {
      console.log('[OneSignal] Foreground notification received:', JSON.stringify(event));
      
      let notif = event;
      if (typeof event.getNotification === 'function') {
        notif = event.getNotification();
      } else if (event.notification) {
        notif = event.notification;
      }

      console.log('[OneSignal] Notification Title:', notif?.title);
      console.log('[OneSignal] Notification Body:', notif?.body);
      console.log('[OneSignal] Additional Data:', notif?.additionalData);

      // Force display system banner in foreground
      if (typeof notif?.display === 'function') {
        notif.display();
      }

      // Show in-app Toast banner immediately when app is open
      Toast.show({
        type: 'info',
        text1: notif?.title || 'Booking Notification 🚌',
        text2: notif?.body || 'You have a new update',
        visibilityTime: 6000,
        position: 'top',
      });
    };

    OneSignal.Notifications.addEventListener('click', clickHandler);
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', foregroundHandler);

    return () => {
      OneSignal.Notifications.removeEventListener('click', clickHandler);
      OneSignal.Notifications.removeEventListener('foregroundWillDisplay', foregroundHandler);
    };
  }, []);

  const onBeforeLift = () => {
    const state = store.getState();
    const currentLang = state.language?.currentLanguage || 'en';
    
    const i18n = require('./src/i18n/i18n').default;
    i18n.changeLanguage(currentLang);
    
    const { handleLanguageRTL } = require('./src/utils/rtl.util');
    handleLanguageRTL(currentLang);

    setTimeout(() => SplashScreen.hide(), 100);
  };

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={onBeforeLift}
      >
        <StripeProvider publishableKey={stripePublishableKey} urlScheme="bookngo">
          <QueryClientProvider client={queryClient}>
            <OneSignalUserSync />
            <RootNavigator />
            <Toast />
          </QueryClientProvider>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
