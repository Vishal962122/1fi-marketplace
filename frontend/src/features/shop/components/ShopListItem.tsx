import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, shadow, spacing } from '@/theme';

interface Props {
  logo: string;
  title: string;
  subtitle: string;
  subtitleLines?: number;
  badge?: string;
}

/** White card row used by both Top Brands and Nearby Stores. */
export function ShopListItem({ logo, title, subtitle, subtitleLines = 1, badge }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: logo }} style={styles.logo} contentFit="contain" transition={150} />
      <View style={styles.body}>
        <AppText variant="h3" numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} numberOfLines={subtitleLines}>
          {subtitle}
        </AppText>
      </View>
      {badge ? (
        <View style={styles.badge}>
          <AppText variant="captionStrong" color={colors.textMuted}>
            {badge}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  body: { flex: 1, gap: 3 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
});
