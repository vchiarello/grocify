import { useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { ui } from "../../components/theme";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  // La registrazione ha DUE fasi: dati account → verifica email
  const [pendingVerification, setPendingVerification] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const busy = fetchStatus === "fetching";

  // FASE 1: creo il tentativo di registrazione e chiedo a Clerk di inviare il codice
  const onSignUp = async () => {
    setNotice(null);
    const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      setNotice("Errore da Clerk: controlla la console");
      return;
    }
    await signUp.verifications.sendEmailCode();
    setPendingVerification(true);
  };

  // FASE 2: verifico il codice ricevuto via email
  const onVerify = async () => {
    setNotice(null);
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      // Utente creato + sessione attivata → il layout (auth) porta alla home
      await signUp.finalize();
    } else {
      // Es. 'missing_requirements' se nel Dashboard hai reso obbligatori altri campi
      setNotice(`Registrazione non ancora completa (stato: ${signUp.status}).`);
    }
  };

  if (pendingVerification) {
    return (
      <View style={ui.screen}>
        <Text style={ui.title}>Controlla la tua email</Text>
        <Text style={ui.subtitle}>
          Abbiamo inviato un codice a {emailAddress}.
        </Text>

        <TextInput
          style={ui.input}
          value={code}
          onChangeText={setCode}
          placeholder="Codice di verifica"
          keyboardType="number-pad"
          autoComplete="one-time-code"
        />
        {errors?.fields?.code && (
          <Text style={ui.error}>{errors.fields.code?.message}</Text>
        )}
        {notice && <Text style={ui.error}>{notice}</Text>}

        <TouchableOpacity
          style={[ui.button, (busy || !code) && ui.buttonDisabled]}
          onPress={onVerify}
          disabled={busy || !code}
        >
          <Text style={ui.buttonText}>
            {busy ? "Verifica in corso…" : "Verifica email"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 16, alignItems: "center" }}
          onPress={() => signUp.verifications.sendEmailCode()}
          disabled={busy}
        >
          <Text style={ui.link}>Invia di nuovo il codice</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const disabled = busy || !emailAddress || !password;

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Crea un account</Text>
      <Text style={ui.subtitle}>
        Ti chiederemo di confermare l'email con un codice.
      </Text>

      <TextInput
        style={ui.input}
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      {errors?.fields?.emailAddress && (
        <Text style={ui.error}>{errors.fields.emailAddress?.message}</Text>
      )}

      <TextInput
        style={ui.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        autoComplete="new-password"
      />
      {errors?.fields?.password && (
        <Text style={ui.error}>{errors.fields.password?.message}</Text>
      )}

      <TouchableOpacity
        style={[ui.button, disabled && ui.buttonDisabled]}
        onPress={onSignUp}
        disabled={disabled}
      >
        <Text style={ui.buttonText}>
          {busy ? "Invio in corso…" : "Registrati"}
        </Text>
      </TouchableOpacity>

      <View style={ui.footer}>
        <Text style={ui.footerText}>Hai già un account?</Text>
        <Link href="/sign-in">
          <Text style={ui.link}>Accedi</Text>
        </Link>
      </View>

      {/* Obbligatorio: punto di aggancio per la protezione anti-bot di Clerk */}
      <View nativeID="clerk-captcha" />
    </View>
  );
}
