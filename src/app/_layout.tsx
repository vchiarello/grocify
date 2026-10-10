import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import "../../global.css";

import { useColorScheme } from "react-native";

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
  //  console.log("[/_layout] ");

  //lo stack element è un componente che permette di gestire la navigazione tra le schermate dell'applicazione.
  //andando avanti e indietro come se fossero delle pagine web.
  const colorScheme = useColorScheme();
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </ClerkProvider>
  );
}
