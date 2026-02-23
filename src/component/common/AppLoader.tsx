import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import busLogo from '../../assets/png/buslogo-removebg-preview.png';

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
        source={busLogo}
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
});



// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   I18nManager,
// } from 'react-native';
// import { scale, verticalScale } from 'react-native-size-matters';

// type AppLoaderProps = {
//   size?: number;
//   speed?: number;
//   direction?: 'auto' | 'ltr' | 'rtl';
// };

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const AppLoader: React.FC<AppLoaderProps> = ({
//   size = 200,
//   speed = 2000,
//   direction = 'auto',
// }) => {
//   const translateX = useRef(new Animated.Value(0)).current;

//   const isRTL =
//     direction === 'auto'
//       ? I18nManager.isRTL
//       : direction === 'rtl';

//   const startX = isRTL ? -scale(size) : SCREEN_WIDTH;
//   const endX = isRTL ? SCREEN_WIDTH : -scale(size);

//   useEffect(() => {
//     translateX.setValue(startX);

//     const animation = Animated.loop(
//       Animated.timing(translateX, {
//         toValue: endX,
//         duration: speed,
//         useNativeDriver: true,
//       })
//     );

//     animation.start();

//     return () => animation.stop();
//   }, [translateX, startX, endX, speed]);

//   return (
//     <View style={styles.fullWidthContainer}>
//       <Animated.Image
//         source={require('../../assets/png/buslogo-removebg-preview.png')}
//         style={{
//           width: scale(size),
//           height: verticalScale(size),
//           transform: [{ translateX }],
//         }}
//         resizeMode="contain"
//       />
//     </View>
//   );
// };

// export default AppLoader;

// const styles = StyleSheet.create({
//   fullWidthContainer: {
//     width: '100%',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
// });
