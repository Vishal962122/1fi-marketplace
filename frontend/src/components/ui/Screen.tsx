import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme';

interface Props {
  children: ReactNode;
  edges?: Edge[];
  background?: string;
}

/** Full-screen container with safe-area handling and the app background. */
export function Screen({ children, edges = ['top'], background = colors.surface }: Props) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
});
