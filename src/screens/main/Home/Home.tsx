import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import colors, { Colors } from '../../../utils/colors';
import HomeSearch from './HomeSearch';
import Header from '../../../component/Header';

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleSearch = (params: { fromCity: string; toCity: string; date: string }) => {
    navigation.navigate('SearchResults' as never, params as never);
  };

  return (
    <ScreenWrapper gradient="upper" header={<Header />} >
      <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText size={28} weight="700" color={Colors.PRIMARY} style={styles.welcomeText}>
            {t('home_welcome') || "Where to next?"}
          </AppText>
          <AppText size={14} color={Colors.DARK_GRAY} style={styles.subtitleText}>
            {t('home_subtitle') || "Find the best bus rides for your journey."}
          </AppText>
        </View>

          <HomeSearch onSearch={handleSearch} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(5),
    paddingTop: verticalScale(5),
  },
  subtitleText: {
    marginTop: 5,
  },
  welcomeText: {
    letterSpacing: -0.5,
  },
});

export default Home;
