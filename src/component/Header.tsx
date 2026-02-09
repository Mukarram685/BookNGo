import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utils/Colors.util';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Arrow } from '../assets/svg';


interface HeaderProps {
  title: string;
  action?: any;
  showBack?: boolean;
}

function Header({ title, action, showBack = true }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}
          >
            <Arrow />
          </TouchableOpacity>
        )}
        <Text style={[styles.title]}>{title}</Text>
      </View>
      <View style={styles.iconContainer}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.DARK_BG,
    flexDirection: 'row',
    paddingVertical: moderateScale(10),
    alignItems: 'center',
    columnGap: verticalScale(0),
    justifyContent: 'space-between'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: verticalScale(10)
  },
  title: {
    fontSize: moderateScale(18),
    color: Colors.WHITE
  },
  iconContainer: {
    flexDirection: 'row',
    columnGap: scale(20),
    paddingRight: scale(10)
  },
  back: {
    marginRight: scale(10)
  }
});

export default Header;
