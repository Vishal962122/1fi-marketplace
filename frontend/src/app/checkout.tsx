import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { StateView } from '@/components/ui/StateView';
import { colors, radii, shadow, spacing } from '@/theme';
import { formatCurrency, formatMonths, formatPercent } from '@/lib/format';
import { useCreateOrder, useEmiPlans, useProduct } from '@/hooks/useMarketplace';
import { buildEmiQuote } from '@/features/marketplace/utils/emi';
import { useCheckoutStore } from '@/features/marketplace/store/checkoutStore';

function nextInstalmentLabel() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { productId, variantId, planId, reset } = useCheckoutStore();
  const [order, setOrder] = useState<{ id: string } | null>(null);

  const productQuery = useProduct(productId ?? '');
  const plansQuery = useEmiPlans();
  const createOrder = useCreateOrder();

  const product = productQuery.data;
  const variant = product?.variants.find((v) => v.id === variantId) ?? null;
  const plan = plansQuery.data?.find((p) => p.id === planId) ?? null;

  const quote = useMemo(
    () => (variant && plan ? buildEmiQuote(variant.price, plan) : null),
    [variant, plan],
  );

  if (!productId || !variantId || !planId) {
    return (
      <Screen>
        <StateView
          title="Nothing to confirm"
          message="Pick a product and an EMI plan first."
          actionLabel="Go to Shop"
          onAction={() => router.replace('/shop')}
        />
      </Screen>
    );
  }

  if (order && product && variant && quote) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.column}>
            <View style={styles.successIcon}>
              <Feather name="check" size={30} color={colors.textInverse} />
            </View>
            <AppText variant="h1" center>
              EMI plan activated
            </AppText>
            <AppText variant="body" color={colors.textMuted} center style={styles.successSub}>
              {product.name} · {variant.label}
            </AppText>

            <View style={styles.receipt}>
              <ReceiptRow label="Order ID" value={order.id} />
              <Dashed />
              <ReceiptRow label="Monthly EMI" value={`${formatCurrency(quote.monthlyEmi)}/mo`} />
              <ReceiptRow label="Tenure" value={formatMonths(quote.tenureMonths)} />
              <ReceiptRow label="Total payable" value={formatCurrency(quote.totalPayable)} strong />
              <Dashed />
              <ReceiptRow label="First instalment" value={nextInstalmentLabel()} />
            </View>

            <Button
              label="Back to Shop"
              onPress={() => {
                reset();
                router.replace('/shop');
              }}
              style={styles.successBtn}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }

  if (productQuery.isLoading || plansQuery.isLoading) {
    return (
      <Screen>
        <StateView emoji="⏳" title="Loading your selection…" />
      </Screen>
    );
  }

  if (!product || !variant || !plan || !quote) {
    return (
      <Screen>
        <StateView
          emoji="⚠️"
          title="Couldn't load your selection"
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const noCost = plan.annualInterestRate === 0;

  return (
    <Screen edges={[]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.column}>
          {/* Receipt / pay-slip */}
          <View style={styles.receipt}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <AppText variant="captionStrong" color={colors.textInverse}>
                  1Fi
                </AppText>
              </View>
              <AppText variant="overline" color={colors.textFaint}>
                EMI Plan Summary
              </AppText>
            </View>

            <View style={styles.itemRow}>
              <Image source={{ uri: product.thumbnail }} style={styles.thumb} contentFit="cover" />
              <View style={styles.itemMeta}>
                <AppText variant="bodyStrong" numberOfLines={1}>
                  {product.name}
                </AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  {variant.label}
                </AppText>
              </View>
              <AppText variant="bodyStrong">{formatCurrency(variant.price)}</AppText>
            </View>

            <Dashed />

            <View style={styles.emiBlock}>
              <AppText variant="overline" color={colors.textFaint}>
                Monthly EMI
              </AppText>
              <View style={styles.emiAmountRow}>
                <AppText variant="display" color={colors.primaryDark}>
                  {formatCurrency(quote.monthlyEmi)}
                </AppText>
                <Badge
                  label={noCost ? 'No cost EMI' : `${formatPercent(plan.annualInterestRate)} p.a.`}
                  tone={noCost ? 'success' : 'brand'}
                />
              </View>
              <AppText variant="caption" color={colors.textMuted}>
                for {formatMonths(plan.tenureMonths)}
              </AppText>
            </View>

            <Dashed />

            <ReceiptRow label="Item price" value={formatCurrency(variant.price)} />
            <ReceiptRow label="Total interest" value={formatCurrency(quote.totalInterest)} />
            <ReceiptRow label="Processing fee" value={formatCurrency(quote.processingFee)} />

            <View style={styles.totalDivider} />

            <ReceiptRow label="Total payable" value={formatCurrency(quote.totalPayable)} strong />
            <AppText variant="caption" color={colors.textMuted} style={styles.totalSub}>
              {formatCurrency(quote.monthlyEmi)}/mo × {formatMonths(plan.tenureMonths)}
            </AppText>

            <Dashed />

            <View style={styles.metaRow}>
              <Feather name="calendar" size={14} color={colors.textMuted} />
              <AppText variant="caption" color={colors.textMuted}>
                First instalment due · {nextInstalmentLabel()}
              </AppText>
            </View>
          </View>

          <View style={styles.note}>
            <Feather name="shield" size={16} color={colors.primary} />
            <AppText variant="caption" color={colors.textMuted} style={styles.noteText}>
              By continuing you authorise 1Fi to pledge units from your portfolio as collateral for
              this EMI. You can foreclose anytime with no penalty.
            </AppText>
          </View>

          {createOrder.isError ? (
            <AppText variant="caption" color={colors.danger} center>
              {(createOrder.error as Error).message}. Please try again.
            </AppText>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.column}>
          <AppText variant="caption" color={colors.textMuted} center style={styles.footerHint}>
            {formatCurrency(quote.monthlyEmi)}/mo · foreclose anytime, no penalty
          </AppText>
          <Button
            label="Confirm & activate plan"
            loading={createOrder.isPending}
            onPress={() =>
              createOrder.mutate(
                { productId: product.id, variantId: variant.id, planId: plan.id },
                { onSuccess: (data) => setOrder({ id: data.id }) },
              )
            }
          />
        </View>
      </View>
    </Screen>
  );
}

function ReceiptRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.receiptRow}>
      <AppText variant={strong ? 'bodyStrong' : 'caption'} color={strong ? colors.text : colors.textMuted}>
        {label}
      </AppText>
      <AppText variant={strong ? 'h2' : 'captionStrong'} style={styles.receiptValue}>
        {value}
      </AppText>
    </View>
  );
}

function Dashed() {
  return <View style={styles.dashed} />;
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    paddingBottom: 140,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    gap: spacing.lg,
  },

  receipt: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  brandMark: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceAlt,
  },
  itemMeta: { flex: 1, gap: 2 },

  emiBlock: { gap: spacing.xs },
  emiAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },

  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  receiptValue: { flexShrink: 1, textAlign: 'right', marginLeft: spacing.lg },

  totalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  totalSub: { textAlign: 'right' },

  dashed: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.divider,
    marginVertical: spacing.md,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    padding: spacing.md,
  },
  noteText: { flex: 1 },

  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerHint: { marginBottom: spacing.sm },

  successIcon: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  successSub: { marginBottom: spacing.sm },
  successBtn: { marginTop: spacing.sm },
});
