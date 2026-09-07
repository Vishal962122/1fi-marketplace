import { View, type ViewProps } from 'react-native';

import { colors, radii, shadow, spacing } from '@/theme';

interface Props extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ padded = true, elevated = true, style, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.background,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: colors.border,
        },
        padded && { padding: spacing.lg },
        elevated && shadow.card,
        style,
      ]}
    />
  );
}
