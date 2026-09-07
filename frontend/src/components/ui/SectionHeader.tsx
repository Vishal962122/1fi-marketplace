import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme';

interface Props {
  title: string;
  /** Small uppercase eyebrow label with the accent bar (e.g. "OFFERS"). */
  overline?: boolean;
  right?: React.ReactNode;
}

export function SectionHeader({ title, overline, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {overline ? <View style={styles.bar} /> : null}
        <AppText variant={overline ? 'overline' : 'h2'} color={overline ? colors.primary : colors.text}>
          {title}
        </AppText>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bar: { width: 3, height: 14, borderRadius: 999, backgroundColor: colors.primary },
});
