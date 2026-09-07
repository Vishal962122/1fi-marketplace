import { View, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme';

interface Props {
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Shared presentation for empty / error / not-found states so every screen
 * handles the "nothing to show" case the same way.
 */
export function StateView({ emoji = '📭', title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.root}>
      <AppText style={styles.emoji}>{emoji}</AppText>
      <AppText variant="h2" center>
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color={colors.textMuted} center style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emoji: { fontSize: 40, marginBottom: spacing.md },
  message: { marginTop: spacing.xs, maxWidth: 280 },
  action: { marginTop: spacing.lg, alignSelf: 'center', paddingHorizontal: spacing.xl },
});
