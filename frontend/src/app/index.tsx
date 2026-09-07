import { Redirect } from 'expo-router';

/** App opens on Home; this assignment's work lives under the Shop tab. */
export default function Index() {
  return <Redirect href="/shop" />;
}
