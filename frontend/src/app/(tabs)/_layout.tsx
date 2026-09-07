import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontFamily, radii, shadow, spacing } from '@/theme';

type FeatherName = keyof typeof Feather.glyphMap;

function TabIcon({ name, color, focused }: { name: FeatherName; color: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.indicator, focused && styles.indicatorActive]} />
      <Feather name={name} size={22} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontFamily: fontFamily.medium, fontSize: 11 },
        tabBarItemStyle: { paddingVertical: spacing.sm },
        tabBarStyle: [
          styles.bar,
          { height: 60 + insets.bottom, paddingBottom: insets.bottom || spacing.sm },
        ],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: (p) => <TabIcon name="home" {...p} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: (p) => <TabIcon name="shopping-bag" {...p} />,
        }}
      />
      <Tabs.Screen
        name="emi-dues"
        options={{
          title: 'EMI Dues',
          tabBarIcon: (p) => <TabIcon name="file-text" {...p} />,
        }}
      />
      <Tabs.Screen
        name="limit"
        options={{
          title: 'Limit',
          tabBarIcon: (p) => <TabIcon name="bar-chart-2" {...p} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: (p) => <TabIcon name="user" {...p} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.sm,
    borderRadius: radii.xl,
    borderTopWidth: 0,
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
    ...shadow.nav,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  indicator: {
    position: 'absolute',
    top: -14,
    width: 22,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  indicatorActive: { backgroundColor: colors.primary },
});
