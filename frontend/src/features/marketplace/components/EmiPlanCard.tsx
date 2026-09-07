import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { colors, radii, spacing } from '@/theme';
import { formatCurrency, formatMonths, formatPercent } from '@/lib/format';
import { buildEmiQuote } from '@/features/marketplace/utils/emi';
import type { EmiPlan } from '@/features/marketplace/types';

interface Props {
  plan: EmiPlan;
  principal: number;
  selected: boolean;
  onSelect: (planId: string) => void;
}

export function EmiPlanCard({ plan, principal, selected, onSelect }: Props) {
  const quote = buildEmiQuote(principal, plan);
  const noCost = plan.annualInterestRate === 0;

  const rows: [string, string][] = [
    ['Interest payable', quote.totalInterest === 0 ? '₹0' : formatCurrency(quote.totalInterest)],
    ['Processing fee', quote.processingFee === 0 ? '₹0' : formatCurrency(quote.processingFee)],
    ['Total payable', formatCurrency(quote.totalPayable)],
  ];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${formatMonths(plan.tenureMonths)} plan, ${formatCurrency(
        quote.monthlyEmi,
      )} per month`}
      onPress={() => onSelect(plan.id)}
      style={[styles.card, selected && styles.selected]}
    >
      <View style={styles.header}>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <View style={styles.radioDot} /> : null}
        </View>

        <View style={styles.headerText}>
          <View style={styles.emiLine}>
            <AppText variant="h2">{formatCurrency(quote.monthlyEmi)}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              /month
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textMuted}>
            {formatMonths(plan.tenureMonths)} ·{' '}
            {noCost ? 'No interest' : `${formatPercent(plan.annualInterestRate)} p.a.`}
          </AppText>
        </View>

        {plan.tag ? (
          <Badge label={plan.tag} tone="success" />
        ) : plan.recommended ? (
          <Badge label="Recommended" tone="brand" />
        ) : null}
      </View>

      <View style={styles.breakdown}>
        {rows.map(([label, value], i) => (
          <View key={label} style={[styles.row, i === rows.length - 1 && styles.rowLast]}>
            <AppText variant="caption" color={colors.textMuted}>
              {label}
            </AppText>
            <AppText variant="captionStrong">{value}</AppText>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  selected: { borderColor: colors.primary },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1, gap: 2 },
  emiLine: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  breakdown: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
});
