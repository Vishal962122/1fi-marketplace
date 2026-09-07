import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, shadow, spacing } from '@/theme';

export interface Segment<T extends string> {
  key: T;
  label: string;
}

interface Props<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (key: T) => void;
}

/** Pill segmented toggle — matches the Top Brands / Nearby Stores switch. */
export function SegmentedControl<T extends string>({ segments, value, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {segments.map((segment) => {
        const active = segment.key === value;
        return (
          <Pressable
            key={segment.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(segment.key)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <AppText
              variant="captionStrong"
              color={active ? colors.primary : colors.textMuted}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              style={styles.label}
            >
              {segment.label}
            </AppText>
            {active ? <View style={styles.underline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    padding: spacing.xs,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.pill,
  },
  label: { textAlign: 'center' },
  segmentActive: {
    backgroundColor: colors.background,
    ...shadow.card,
  },
  underline: {
    position: 'absolute',
    bottom: 4,
    width: 22,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});
