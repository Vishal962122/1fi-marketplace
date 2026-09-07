import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme';
import type { ProductVariant } from '@/features/marketplace/types';

interface Props {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

/**
 * Attribute-driven variant picker. It reads the attribute keys off the
 * variants themselves (Storage, Colour, Memory…), renders a chip row per key,
 * and resolves the concrete variant from the chosen combination.
 */
export function VariantSelector({ variants, selectedVariantId, onSelect }: Props) {
  const attributeKeys = useMemo(
    () => Array.from(new Set(variants.flatMap((v) => Object.keys(v.attributes)))),
    [variants],
  );

  const selected = variants.find((v) => v.id === selectedVariantId) ?? null;

  const pick = (key: string, value: string) => {
    const target = { ...(selected?.attributes ?? {}), [key]: value };
    // Prefer an exact match; otherwise the first variant that matches this key.
    const exact = variants.find((v) =>
      Object.entries(target).every(([k, val]) => v.attributes[k] === val),
    );
    const fallback = variants.find((v) => v.attributes[key] === value);
    const next = exact ?? fallback;
    if (next) onSelect(next.id);
  };

  return (
    <View style={styles.root}>
      {attributeKeys.map((key) => {
        const values = Array.from(new Set(variants.map((v) => v.attributes[key]).filter(Boolean)));
        return (
          <View key={key} style={styles.group}>
            <AppText variant="captionStrong" color={colors.textMuted}>
              {key}
            </AppText>
            <View style={styles.chips}>
              {values.map((value) => {
                const isSelected = selected?.attributes[key] === value;
                const available = variants.some(
                  (v) => v.attributes[key] === value && v.inStock,
                );
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected, disabled: !available }}
                    onPress={() => pick(key, value)}
                    disabled={!available}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                      !available && styles.chipDisabled,
                    ]}
                  >
                    <AppText
                      variant="captionStrong"
                      color={isSelected ? colors.primaryDark : colors.text}
                    >
                      {value}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}

      {selected && !selected.inStock ? (
        <AppText variant="caption" color={colors.danger}>
          This combination is currently out of stock.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  group: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  chipDisabled: { opacity: 0.4 },
});
