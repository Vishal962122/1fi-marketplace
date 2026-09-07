import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { HoverScale } from '@/components/ui/HoverScale';
import { colors, radii, shadow, spacing } from '@/theme';
import { formatCurrency } from '@/lib/format';
import type { ProductSummary } from '@/features/marketplace/types';

interface Props {
  product: ProductSummary;
  /** Lowest monthly EMI across plans, for the "EMI from …" line. */
  emiFrom: number;
  onPress: (id: string) => void;
}

/** Showcase-style product tile — image-forward, hover-zoom, all detail inside. */
export function ProductCard({ product, emiFrom, onPress }: Props) {
  const discount =
    product.startingMrp > product.startingPrice
      ? Math.round(
          ((product.startingMrp - product.startingPrice) / product.startingMrp) * 100,
        )
      : 0;

  return (
    <HoverScale
      onPress={() => onPress(product.id)}
      accessibilityLabel={`${product.name}, from ${formatCurrency(product.startingPrice)}`}
      style={styles.pressable}
    >
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
          {discount > 0 ? (
            <View style={styles.discount}>
              <AppText variant="captionStrong" color={colors.textInverse}>
                {discount}% OFF
              </AppText>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
            {product.brand}
          </AppText>
          <AppText variant="h3" numberOfLines={2} style={styles.name}>
            {product.name}
          </AppText>

          <View style={styles.priceRow}>
            <AppText variant="bodyStrong">{formatCurrency(product.startingPrice)}</AppText>
            {discount > 0 ? (
              <AppText variant="caption" color={colors.textFaint} style={styles.strike}>
                {formatCurrency(product.startingMrp)}
              </AppText>
            ) : null}
          </View>

          {product.rating ? (
            <AppText variant="caption" color={colors.textMuted}>
              ★ {product.rating.toFixed(1)} ({product.ratingCount})
            </AppText>
          ) : null}

          <View style={styles.emiPill}>
            <AppText variant="captionStrong" color={colors.primary}>
              EMI from {formatCurrency(emiFrom)}/mo
            </AppText>
          </View>
        </View>
      </View>
    </HoverScale>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  image: { width: '100%', height: '100%' },
  discount: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  body: { padding: spacing.md, gap: 3 },
  name: { minHeight: 40 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  strike: { textDecorationLine: 'line-through' },
  emiPill: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
});
