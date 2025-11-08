import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
        setText(state.isConnected ? 'Online' : 'Offline');
      
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
        <Text style={styles.text}> is Connected: {text}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NetworkStatus;
