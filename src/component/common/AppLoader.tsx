import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  scale,
  verticalScale
} from 'react-native-size-matters';

type AppLoaderProps = {
  size?: number;
};

const AppLoader: React.FC<AppLoaderProps> = ({ size = 120 }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/png/buslogo-removebg-preview.png')}
        style={{
          width: scale(size),
          height: verticalScale(size)
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
