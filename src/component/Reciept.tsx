import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import { useTranslation } from 'react-i18next';

export default function ReceiptScreen() {
  const { t } = useTranslation();
  const receiptRef = useRef();

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
    }
  };

  const shareReceipt = async () => {
    try {
      await requestPermission();

      const uri = await receiptRef.current.capture({
        format: 'png',
        quality: 1,
      });

      const filePath =
        RNFS.PicturesDirectoryPath + `/order_receipt_${Date.now()}.png`;

      await RNFS.moveFile(uri, filePath);
      await RNFS.scanFile(filePath);

      await Share.open({
        url: 'file://' + filePath,
        type: 'image/png',
      });
    } catch (err) {
      console.log('Error sharing receipt', err);
    }
  };

  return (
    <>
      <ViewShot ref={receiptRef} style={styles.container}>
        <View style={styles.receipt}>
          <Text style={styles.title}>{t('payment_successful') || "Payment Successful"}</Text>
          <Text>{t('order_id')}: #ORD456789</Text>
          <Text>{t('amount')}: Rs. 3,200</Text>
          <Text>{t('date')}: 02 Feb 2026</Text>
          <Text>{t('status')}: {t('completed')}</Text>
        </View>
      </ViewShot>

      <TouchableOpacity style={styles.shareBtn} onPress={shareReceipt}>
        <Text style={styles.shareText}>{t('share_receipt') || "Share Receipt"}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  receipt: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shareBtn: {
    margin: 20,
    padding: 15,
    backgroundColor: '#0a84ff',
    borderRadius: 10,
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
  },
});
