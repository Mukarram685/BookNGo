import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen';

const App = () => {

    useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>App</Text>
    </View>
  )
}

export default App