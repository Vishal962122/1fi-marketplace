import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { SearchInput } from '@/components/ui/SearchInput';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl, type Segment } from '@/components/ui/SegmentedControl';
import { StateView } from '@/components/ui/StateView';
import { colors, radii, spacing } from '@/theme';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useEmiPlans, useProducts } from '@/hooks/useMarketplace';
import { CategoryChips } from '@/features/marketplace/components/CategoryChips';
import { ProductGrid } from '@/features/marketplace/components/ProductGrid';
import { ShopListItem } from '@/features/shop/components/ShopListItem';
import { nearbyStores, topBrands } from '@/features/shop/data/shopContent';

const BANNER = 'https://cdn.1fi.in/banners/shop-page%201536x1024.webp';

type ShopTab = 'brands' | 'stores' | 'marketplace';
const SEGMENTS: Segment<ShopTab>[] = [
  { key: 'brands', label: 'Top Brands' },
  { key: 'stores', label: 'Nearby Stores' },
  { key: 'marketplace', label: '1Fi Marketplace' },
];

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Audio'];

const PLACEHOLDER: Record<ShopTab, string> = {
  brands: 'Search online stores…',
  stores: 'Search stores…',
  marketplace: 'Search products or brands',
};

export default function ShopScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<ShopTab>('brands');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const debouncedQuery = useDebouncedValue(query, 350);

  const brands = useMemo(
    () => topBrands.filter((b) => b.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const stores = useMemo(
    () => nearbyStores.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const productsQuery = useProducts(
    tab === 'marketplace'
      ? { search: debouncedQuery || undefined, category }
      : {},
  );
  const plansQuery = useEmiPlans();

  const switchTab = (next: ShopTab) => {
    setTab(next);
    setQuery('');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image
          source={{ uri: BANNER }}
          style={styles.banner}
          contentFit="cover"
          transition={200}
          accessibilityLabel="Shop today, pay later using mutual funds"
        />

        <SegmentedControl segments={SEGMENTS} value={tab} onChange={switchTab} />

        <SearchInput value={query} onChangeText={setQuery} placeholder={PLACEHOLDER[tab]} />

        {tab === 'brands' ? (
          <View style={styles.section}>
            <SectionHeader title="Top Brands" />
            {brands.length ? (
              brands.map((brand) => (
                <ShopListItem
                  key={brand.id}
                  logo={brand.logo}
                  title={brand.name}
                  subtitle={brand.offer}
                />
              ))
            ) : (
              <StateView title="No brands found" message="Try a different brand name." />
            )}
          </View>
        ) : null}

        {tab === 'stores' ? (
          <View style={styles.section}>
            <SectionHeader
              title="Nearby Stores"
              right={
                <View style={styles.location}>
                  <AppText variant="captionStrong" color={colors.primary}>
                    Gautam Buddha Nagar
                  </AppText>
                  <Feather name="chevron-down" size={14} color={colors.primary} />
                </View>
              }
            />
            {stores.length ? (
              stores.map((store) => (
                <ShopListItem
                  key={store.id}
                  logo={store.logo}
                  title={store.name}
                  subtitle={store.address}
                  subtitleLines={2}
                  badge={`${store.distanceKm} KM`}
                />
              ))
            ) : (
              <StateView title="No matching stores found" message="Try a different store name." />
            )}
          </View>
        ) : null}

        {tab === 'marketplace' ? (
          <View style={styles.section}>
            <SectionHeader title="1Fi Marketplace" />
            <CategoryChips categories={CATEGORIES} active={category} onChange={setCategory} />
            <ProductGrid
              products={productsQuery.data}
              plans={plansQuery.data}
              isLoading={productsQuery.isLoading}
              isError={productsQuery.isError}
              onRetry={productsQuery.refetch}
              onPressProduct={(id) => router.push(`/product/${id}`)}
            />
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 110,
    gap: spacing.lg,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  banner: {
    width: '100%',
    aspectRatio: 1536 / 1024,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceAlt,
  },
  section: { gap: spacing.md },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    backgroundColor: colors.primaryTint,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
