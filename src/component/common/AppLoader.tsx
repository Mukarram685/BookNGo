import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

type AppLoaderProps = {
  size?: number;
  speed?: number;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AppLoader: React.FC<AppLoaderProps> = ({
  size = 200,
  speed = 2000,
}) => {
  const translateX = useRef(
    new Animated.Value(SCREEN_WIDTH)
  ).current;

  useEffect(() => {
    translateX.setValue(SCREEN_WIDTH);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -scale(size),
        duration: speed,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [translateX, size, speed]);

  return (
    <View style={styles.fullWidthContainer}>
      <Animated.Image
        source={require('../../assets/png/buslogo-removebg-preview.png')}
        style={{
          width: scale(size),
          height: verticalScale(size),
          transform: [{ translateX }],
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  fullWidthContainer: {
    width: '100%',           // 🔥 full screen width
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
});
