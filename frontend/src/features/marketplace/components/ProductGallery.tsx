import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

interface Props {
  images: string[];
}

/** Swipeable, paged image carousel that sizes itself to its container. */
export function ProductGallery({ images }: Props) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const data = images.length ? images : [''];

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View onLayout={onLayout}>
      {width > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(uri, i) => `${uri}-${i}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width, height: width }}
              contentFit="cover"
              transition={200}
            />
          )}
        />
      ) : (
        <View style={styles.placeholder} />
      )}

      {data.length > 1 ? (
        <View style={styles.dots}>
          {data.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { width: '100%', aspectRatio: 1, backgroundColor: colors.surfaceAlt },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 18 },
});
