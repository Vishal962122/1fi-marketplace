import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme';

interface Props {
  label: string;
  tone?: 'brand' | 'success' | 'neutral' | 'warning' | 'inverse';
}

const TONES = {
  brand: { bg: colors.primarySoft, fg: colors.primaryDark },
  success: { bg: colors.successSoft, fg: colors.success },
  neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
  warning: { bg: '#FEF0E6', fg: colors.warning },
  inverse: { bg: 'rgba(255,255,255,0.22)', fg: colors.textInverse },
} as const;

export function Badge({ label, tone = 'brand' }: Props) {
  const c = TONES[tone];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: c.bg,
        borderRadius: radii.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
      }}
    >
      <AppText variant="captionStrong" color={c.fg}>
        {label}
      </AppText>
    </View>
  );
}
