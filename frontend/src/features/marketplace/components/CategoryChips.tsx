import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme';

interface Props {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export function CategoryChips({ categories, active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const selected = category === active;
        return (
          <Pressable
            key={category}
            onPress={() => onChange(category)}
            style={[styles.chip, selected && styles.chipActive]}
          >
            <AppText
              variant="captionStrong"
              color={selected ? colors.textInverse : colors.textMuted}
            >
              {category}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
});
