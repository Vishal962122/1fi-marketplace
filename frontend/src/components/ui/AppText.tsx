import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typography, type TypographyVariant } from '@/theme';

interface Props extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  center?: boolean;
}

/** The only text component in the app. Guarantees consistent type + colour. */
export function AppText({
  variant = 'body',
  color = colors.text,
  center,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        typography[variant] as TextStyle,
        { color },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}
