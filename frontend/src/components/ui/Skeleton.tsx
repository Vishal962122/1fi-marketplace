import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, Easing, StyleSheet } from 'react-native';

import { colors, radii } from '@/theme';

interface Props {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: object;
}

/** Shimmering placeholder block used to build loading states. */
export function Skeleton({ width = '100%', height = 16, radius = radii.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.base, { width, height, borderRadius: radius, opacity }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.skeleton },
});
