import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Animated, Pressable, type StyleProp, type ViewStyle } from 'react-native';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  scaleTo?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Wraps content in a pressable that lifts/zooms on hover (web) and dips on
 * press. Hover is a no-op on native, so the same component works everywhere.
 */
export function HoverScale({
  children,
  onPress,
  scaleTo = 1.03,
  accessibilityLabel,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 140,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => animate(scaleTo)}
      onHoverOut={() => animate(1)}
      onPressIn={() => animate(0.98)}
      onPressOut={() => animate(1)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}
