import { useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import CalendarPage from '@/components/pages/calendar-page';
import HomePage from '@/components/pages/home-page';
import SettingsPage from '@/components/pages/settings-page';
import SocialPage from '@/components/pages/social-page';
import { DebugDateProvider } from '@/context/debug-date-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Page order: Social (0) | Home (1) | Calendar (2) | Settings (3)
const HOME_INDEX = 1;

export default function SwipeRoot() {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <DebugDateProvider>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentOffset={{ x: HOME_INDEX * SCREEN_WIDTH, y: 0 }}
        style={styles.container}
      >
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}><SocialPage /></View>
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}><HomePage /></View>
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}><CalendarPage /></View>
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}><SettingsPage /></View>
      </ScrollView>
    </DebugDateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
