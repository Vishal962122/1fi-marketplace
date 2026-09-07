import { View, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateView } from '@/components/ui/StateView';
import { colors, spacing } from '@/theme';
import { EmiPlanCard } from '@/features/marketplace/components/EmiPlanCard';
import type { EmiPlan } from '@/features/marketplace/types';

interface Props {
  plans: EmiPlan[] | undefined;
  principal: number;
  isLoading: boolean;
  isError: boolean;
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
  onRetry: () => void;
}

export function EmiPlanList({
  plans,
  principal,
  isLoading,
  isError,
  selectedPlanId,
  onSelect,
  onRetry,
}: Props) {
  if (isLoading) {
    return (
      <View style={styles.list}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={148} radius={18} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateView
        emoji="⚠️"
        title="Couldn't load EMI plans"
        message="Check your connection and try again."
        actionLabel="Retry"
        onAction={onRetry}
      />
    );
  }

  if (!plans?.length) {
    return <StateView title="No EMI plans available for this product" />;
  }

  return (
    <View style={styles.list}>
      <AppText variant="caption" color={colors.textMuted}>
        Plans are calculated on {`₹${principal.toLocaleString('en-IN')}`}. Choose one to continue.
      </AppText>
      {plans.map((plan) => (
        <EmiPlanCard
          key={plan.id}
          plan={plan}
          principal={principal}
          selected={plan.id === selectedPlanId}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
});
