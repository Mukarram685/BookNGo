import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import HomeSearch from './HomeSearch';
import Header from '../../../component/Header'; 

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const handleSearch = (params: { fromCity: string; toCity: string; date: string }) => {
    navigation.navigate('SearchResults', params);
  };

  return (
    <ScreenWrapper header={<Header title="Home" />}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText size={24} weight="700">
            Where to next?
          </AppText>
          <AppText size={14}>
            Find the best bus rides for your journey.
          </AppText>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <HomeSearch onSearch={handleSearch} />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  header: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
});

export default Home;
