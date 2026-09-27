import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";

// La chiave viene "inlinata" da Metro al momento del bundle (prefisso EXPO_PUBLIC_)
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Manca EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY nel file .env");
}

/**
 * Root layout: avvolge TUTTA l'app nel ClerkProvider.
 * - tokenCache salva il token in expo-secure-store (Keychain su iOS,
 *   Keystore su Android), così la sessione sopravvive ai riavvii.
 * - Qui NON si usano hook di Clerk: vanno usati solo nei componenti figli.
 */
export default function RootLayout() {
  console.log("[/_layout] ");

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack />
    </ClerkProvider>
  );
}
