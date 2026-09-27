import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { ui } from "../../components/theme";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  // true quando Clerk chiede di confermare il nuovo dispositivo (Device Trust)
  const [needsDeviceCheck, setNeedsDeviceCheck] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const busy = fetchStatus === "fetching";

  // FASE 1: email + password
  const onSignIn = async () => {
    setNotice(null);

    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize();
    } else if (signIn.status === "needs_client_trust") {
      // Password corretta, ma da un dispositivo che Clerk non conosce ancora:
      // serve un codice inviato via email per "fidarsi" del dispositivo
      const hasEmailCode = signIn.supportedSecondFactors.some(
        (factor) => factor.strategy === "email_code",
      );
      if (hasEmailCode) {
        await signIn.mfa.sendEmailCode();
        setNeedsDeviceCheck(true);
      } else {
        setNotice(
          "Verifica del dispositivo richiesta, ma il codice via email non è abilitato.",
        );
      }
    } else {
      // Es. 'needs_second_factor' se l'utente ha attivato la MFA
      setNotice(
        `Serve un passaggio aggiuntivo per accedere (stato: ${signIn.status}).`,
      );
    }
  };

  // FASE 2 (solo su dispositivo nuovo): verifica del codice email
  const onVerifyDevice = async () => {
    setNotice(null);
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize();
    } else {
      setNotice(`Verifica non completata (stato: ${signIn.status}).`);
    }
  };

  if (needsDeviceCheck) {
    return (
      <View style={ui.screen}>
        <Text style={ui.title}>Conferma che sei tu</Text>
        <Text style={ui.subtitle}>
          Stai accedendo da un nuovo dispositivo. Abbiamo inviato un codice a{" "}
          {emailAddress}.
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
          onPress={onVerifyDevice}
          disabled={busy || !code}
        >
          <Text style={ui.buttonText}>
            {busy ? "Verifica in corso…" : "Verifica e accedi"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 16, alignItems: "center" }}
          onPress={() => signIn.mfa.sendEmailCode()}
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
      <Text style={ui.title}>Accedi</Text>
      <Text style={ui.subtitle}>
        Usa l'email e la password del tuo account.
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
      {errors?.fields?.identifier && (
        <Text style={ui.error}>{errors.fields.identifier?.message}</Text>
      )}

      <TextInput
        style={ui.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        autoComplete="password"
      />
      {errors?.fields?.password && (
        <Text style={ui.error}>{errors.fields.password?.message}</Text>
      )}

      {notice && <Text style={ui.error}>{notice}</Text>}

      <TouchableOpacity
        style={[ui.button, disabled && ui.buttonDisabled]}
        onPress={onSignIn}
        disabled={disabled}
      >
        <Text style={ui.buttonText}>
          {busy ? "Accesso in corso…" : "Accedi"}
        </Text>
      </TouchableOpacity>

      <View style={ui.footer}>
        <Text style={ui.footerText}>Non hai un account?</Text>
        <Link href="/sign-up">
          <Text style={ui.link}>Registrati</Text>
        </Link>
      </View>
    </View>
  );
}
