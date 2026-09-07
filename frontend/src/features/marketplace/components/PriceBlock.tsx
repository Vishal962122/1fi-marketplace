import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme';
import { formatCurrency } from '@/lib/format';

interface Props {
  price: number;
  mrp: number;
}

export function PriceBlock({ price, mrp }: Props) {
  const hasDiscount = mrp > price;
  const off = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <View style={styles.row}>
      <AppText variant="display">{formatCurrency(price)}</AppText>
      {hasDiscount ? (
        <>
          <AppText
            variant="body"
            color={colors.textMuted}
            style={styles.strike}
          >
            {formatCurrency(mrp)}
          </AppText>
          <AppText variant="bodyStrong" color={colors.success}>
            {off}% off
          </AppText>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  strike: { textDecorationLine: 'line-through' },
});
