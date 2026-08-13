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
    <ScreenWrapper shouldShowGradientBackground={true}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText size={28} weight="700" color={Colors.PRIMARY} style={{ letterSpacing: -0.5 }}>
            {t('home_welcome') || "Where to next?"}
          </AppText>
          <AppText size={14} color={Colors.DARK_GRAY} style={{ marginTop: 10 }}>
            {t('home_subtitle') || "Find the best bus rides for your journey."}
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
    paddingHorizontal: scale(10),
    paddingTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
});

export default Home;
