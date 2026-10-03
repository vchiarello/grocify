import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/**
 * Layout del gruppo (home): è la "guardia" dell'area protetta.
 * Ogni schermata dentro app/(home)/ è accessibile solo da autenticati.
 */
export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  // Non autenticato (primo avvio, logout, sessione scaduta) → login
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
