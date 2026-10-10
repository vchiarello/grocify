import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {
  //questo dice quale SSO si sta usando, per poi mettere uno spinner
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  //vedere la documentazione di Clerk per capire come funziona l'SSO, ma in pratica serve a gestire l'autenticazione tramite provider esterni (es. Google, Facebook, ecc.)
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_github" | "oauth_apple",
  ) => {
    if (loadingStrategy) return; // Se c'è già un caricamento in corso, non fare nulla

    setLoadingStrategy(strategy);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (!createdSessionId || !setActive) {
        Alert.alert(
          "Sign-in incomplete",
          "Sign-in did not complete. Please try again.",
        );
        return;
      }

      await setActive({ session: createdSessionId });
    } catch (error) {
      console.error("Errore in social auth:", error);
      Alert.alert("Errore", "Failed to sign in. Please try again.");
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;
