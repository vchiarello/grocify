import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/**
 * Layout del gruppo (auth): contiene sign-in e sign-up.
 * Se l'utente è GIÀ autenticato non ha senso mostrargli il login,
 * quindi lo rimandiamo alla home.
 */
export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  console.log("[(Auth)/_layout] ");

  // Clerk sta ancora leggendo il token dallo storage: non mostriamo nulla
  if (!isLoaded) return null;

  if (isSignedIn) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
