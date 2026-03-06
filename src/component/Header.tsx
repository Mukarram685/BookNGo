import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utils/Colors.util';
import { moderateScale, scale } from 'react-native-size-matters';
import { Arrow } from '../assets/svg';


interface HeaderProps {
  title: string;
  action?: any;
  showBack?: boolean;
}

function Header({ title, action, showBack = false }: HeaderProps) {
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
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    paddingVertical: moderateScale(15),
    paddingHorizontal: scale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(10)
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.WHITE
  },
  iconContainer: {
    flexDirection: 'row',
    columnGap: scale(20),
    paddingRight: scale(10)
  },
  back: {
    marginRight: scale(5)
  }
});

export default Header;
