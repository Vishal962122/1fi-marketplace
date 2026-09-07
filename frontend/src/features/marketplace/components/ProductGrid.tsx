import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { StateView } from '@/components/ui/StateView';
import { colors, spacing } from '@/theme';
import { buildEmiQuote } from '@/features/marketplace/utils/emi';
import { ProductCard } from '@/features/marketplace/components/ProductCard';
import { ProductCardSkeleton } from '@/features/marketplace/components/ProductCardSkeleton';
import type { EmiPlan, ProductSummary } from '@/features/marketplace/types';

interface Props {
  products: ProductSummary[] | undefined;
  plans: EmiPlan[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPressProduct: (id: string) => void;
  /** How many products to reveal per page. */
  pageSize?: number;
}

const GAP = spacing.md;

export function ProductGrid({
  products,
  plans,
  isLoading,
  isError,
  onRetry,
  onPressProduct,
  pageSize = 6,
}: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  // 3-up on anything roomy (web / tablet / the centred column), 2-up on phones.
  const columns = width >= 520 ? 3 : 2;
  const cardWidth = width > 0 ? (width - GAP * (columns - 1)) / columns : 0;

  // Client-side pagination — the list endpoint returns the full array, so we
  // reveal it a page at a time and reset whenever the result set changes
  // (new search term, category switch, refetch).
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const resultKey = products?.map((p) => p.id).join(',') ?? '';
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [resultKey, pageSize]);

  // "EMI from" uses the longest tenure (lowest monthly instalment).
  const longestPlan = useMemo(
    () => plans?.slice().sort((a, b) => b.tenureMonths - a.tenureMonths)[0],
    [plans],
  );

  const emiFrom = (price: number) =>
    longestPlan ? buildEmiQuote(price, longestPlan).monthlyEmi : Math.round(price / 12);

  const renderCells = (children: ReactNode[]) => (
    <View style={styles.grid} onLayout={onLayout}>
      {width === 0
        ? null
        : children.map((child, i) => (
            <View key={i} style={{ width: cardWidth }}>
              {child}
            </View>
          ))}
    </View>
  );

  if (isLoading) {
    return renderCells(Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />));
  }

  if (isError) {
    return (
      <StateView
        emoji="⚠️"
        title="Couldn't load products"
        message="Please check your connection and try again."
        actionLabel="Retry"
        onAction={onRetry}
      />
    );
  }

  if (!products?.length) {
    return (
      <StateView title="No products found" message="Try a different search term or category." />
    );
  }

  const visible = products.slice(0, visibleCount);
  const remaining = products.length - visible.length;
  const expanded = remaining === 0 && products.length > pageSize;

  return (
    <View style={styles.wrapper}>
      {renderCells(
        visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            emiFrom={emiFrom(product.startingPrice)}
            onPress={onPressProduct}
          />
        )),
      )}

      {remaining > 0 ? (
        <Button
          variant="secondary"
          label={`Load more (${remaining})`}
          onPress={() => setVisibleCount((c) => c + pageSize)}
        />
      ) : (
        <>
          <AppText variant="caption" color={colors.textMuted} center style={styles.end}>
            Showing all {products.length} products
          </AppText>
          {expanded ? (
            <Button
              variant="secondary"
              label="Show less"
              onPress={() => setVisibleCount(pageSize)}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  end: { textAlign: 'center', paddingVertical: spacing.xs },
});
