import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateView } from '@/components/ui/StateView';
import { colors, radii, spacing } from '@/theme';
import { formatCurrency } from '@/lib/format';
import { useEmiPlans, useProduct } from '@/hooks/useMarketplace';
import { EmiPlanList } from '@/features/marketplace/components/EmiPlanList';
import { PriceBlock } from '@/features/marketplace/components/PriceBlock';
import { ProductGallery } from '@/features/marketplace/components/ProductGallery';
import { VariantSelector } from '@/features/marketplace/components/VariantSelector';
import { useCheckoutStore } from '@/features/marketplace/store/checkoutStore';

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();

  const productQuery = useProduct(productId);
  const plansQuery = useEmiPlans();

  const { variantId, planId, setProduct, selectVariant, selectPlan } = useCheckoutStore();
  const product = productQuery.data;

  useEffect(() => {
    if (!product) return;
    setProduct(product.id);
    const alreadyChosen = product.variants.some(
      (v) => v.id === useCheckoutStore.getState().variantId,
    );
    if (alreadyChosen) return;
    const firstInStock = product.variants.find((v) => v.inStock) ?? product.variants[0];
    if (firstInStock) selectVariant(firstInStock.id);
  }, [product, setProduct, selectVariant]);

  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.id === variantId) ?? null,
    [product, variantId],
  );

  if (productQuery.isLoading) return <DetailSkeleton />;

  if (productQuery.isError || !product) {
    return (
      <Screen>
        <StateView
          emoji="⚠️"
          title="Product unavailable"
          message="We couldn't load this product right now."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const price = selectedVariant?.price ?? product.startingPrice;
  const mrp = selectedVariant?.mrp ?? product.startingMrp;
  const canProceed = Boolean(selectedVariant?.inStock && planId);
  const galleryImages = selectedVariant?.image
    ? [selectedVariant.image, ...product.images]
    : product.images;

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: product.brand }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card padded={false} style={styles.galleryCard}>
          <ProductGallery images={galleryImages} />
        </Card>

        <Card style={styles.card}>
          <AppText variant="caption" color={colors.textMuted}>
            {product.brand}
          </AppText>
          <AppText variant="h1">{product.name}</AppText>
          {product.rating ? (
            <AppText variant="caption" color={colors.textMuted}>
              ★ {product.rating.toFixed(1)} ({product.ratingCount} ratings)
            </AppText>
          ) : null}
          <View style={styles.priceSpacing}>
            <PriceBlock price={price} mrp={mrp} />
          </View>
        </Card>

        <Card style={styles.card}>
          <AppText variant="h2">Choose a variant</AppText>
          <VariantSelector
            variants={product.variants}
            selectedVariantId={variantId}
            onSelect={selectVariant}
          />
        </Card>

        <Card style={styles.card}>
          <AppText variant="h2">EMI plans</AppText>
          <EmiPlanList
            plans={plansQuery.data}
            principal={price}
            isLoading={plansQuery.isLoading}
            isError={plansQuery.isError}
            selectedPlanId={planId}
            onSelect={selectPlan}
            onRetry={plansQuery.refetch}
          />
        </Card>

        <Card style={styles.card}>
          <AppText variant="h2">Highlights</AppText>
          {product.highlights.map((h) => (
            <View key={h} style={styles.bulletRow}>
              <AppText color={colors.primary}>•</AppText>
              <AppText variant="body" style={styles.bulletText}>
                {h}
              </AppText>
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <AppText variant="h2">Specifications</AppText>
          <View style={styles.specTable}>
            {product.specifications.map((spec, i) => (
              <View key={spec.label} style={[styles.specRow, i > 0 && styles.specRowBordered]}>
                <AppText variant="caption" color={colors.textMuted}>
                  {spec.label}
                </AppText>
                <AppText variant="captionStrong" style={styles.specValue}>
                  {spec.value}
                </AppText>
              </View>
            ))}
          </View>
          <AppText variant="body" color={colors.textMuted} style={styles.description}>
            {product.description}
          </AppText>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <AppText variant="caption" color={colors.textMuted}>
            {planId ? 'Item price' : 'Select an EMI plan'}
          </AppText>
          <AppText variant="bodyStrong">{canProceed ? formatCurrency(price) : '—'}</AppText>
        </View>
        <Button
          label="Proceed"
          onPress={() => router.push('/checkout')}
          disabled={!canProceed}
          style={styles.footerButton}
        />
      </View>
    </Screen>
  );
}

function DetailSkeleton() {
  return (
    <Screen edges={[]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Skeleton height={300} radius={radii.lg} />
        <Skeleton height={120} radius={radii.lg} />
        <Skeleton height={140} radius={radii.lg} />
        <Skeleton height={260} radius={radii.lg} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 130,
    gap: spacing.lg,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  galleryCard: { overflow: 'hidden' },
  card: { gap: spacing.md },
  priceSpacing: { marginTop: spacing.xs },
  bulletRow: { flexDirection: 'row', gap: spacing.sm },
  bulletText: { flex: 1 },
  specTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  specRowBordered: { borderTopWidth: 1, borderTopColor: colors.border },
  specValue: { flexShrink: 1, textAlign: 'right', marginLeft: spacing.lg },
  description: { marginTop: spacing.xs },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerInfo: { flex: 1 },
  footerButton: { flex: 1.4, maxWidth: 220 },
});
