import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { colors, radii, spacing } from '@/theme';

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.body}>
        <Skeleton width="40%" height={10} />
        <Skeleton width="85%" height={14} />
        <Skeleton width="55%" height={14} />
        <Skeleton width="60%" height={18} radius={999} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.skeleton },
  body: { padding: spacing.md, gap: spacing.sm },
});
