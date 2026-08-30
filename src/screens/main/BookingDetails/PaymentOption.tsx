import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import colors, { Colors, alpha } from '../../../utils/colors';
import AppText from '../../../component/common/AppText';

interface PaymentOptionProps {
  title: string;
  selected: boolean;
  onSelect: () => void;
  icon?: string;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({ title, selected, onSelect, icon }) => (
  <TouchableOpacity
    style={[styles.paymentCard, selected && styles.paymentCardSelected]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <View style={styles.paymentInfo}>
      {icon && <Image source={{ uri: icon }} style={styles.paymentIcon} />}
      <AppText color={selected ? Colors.PRIMARY : Colors.DARK_GRAY} weight={selected ? "700" : "500"}>
        {title}
      </AppText>
    </View>
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.SURFACE,
    padding: scale(15),
    borderRadius: scale(12),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentCardSelected: {
    borderColor: '#172C6B', // Navy border
    backgroundColor: 'rgba(23, 44, 107, 0.05)', // Light navy backdrop
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: scale(30),
    height: scale(20),
    resizeMode: 'contain',
    marginRight: scale(12),
  },
  radio: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: Colors.TEXT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#172C6B',
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: '#172C6B',
  },
});

export default PaymentOption;
