import { Screen } from '@/components/ui/Screen';
import { StateView } from '@/components/ui/StateView';

export default function ProfileScreen() {
  return (
    <Screen>
      <StateView emoji="👤" title="Profile" message="Not part of this assignment." />
    </Screen>
  );
}
