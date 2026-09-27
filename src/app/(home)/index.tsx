import { useAuth, useUser } from "@clerk/expo";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { colors, ui } from "../../components/theme";

/**
 * Home protetta: corrisponde alla rotta "/".
 * I gruppi tra parentesi non compaiono nell'URL, quindi (home)/index.tsx = "/".
 */
export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress;

  return (
    <View style={[ui.screen, { justifyContent: "flex-start", paddingTop: 40 }]}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 28 }}
      >
        <Image
          source={{ uri: user.imageUrl }}
          style={{ width: 56, height: 56, borderRadius: 28, marginRight: 14 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[ui.title, { marginBottom: 2 }]}>
            Ciao{user.firstName ? `, ${user.firstName}` : ""}
          </Text>
          <Text style={{ color: colors.muted }}>{email}</Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.line,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <Text style={{ fontWeight: "600", color: colors.ink, marginBottom: 8 }}>
          Dettagli account
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 4 }}>
          ID utente: {user.id}
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 4 }}>
          Creato il: {user.createdAt?.toLocaleDateString("it-IT")}
        </Text>
        <Text style={{ color: colors.muted }}>
          Ultimo accesso: {user.lastSignInAt?.toLocaleString("it-IT")}
        </Text>
      </View>

      {/* signOut() rimuove il token dal secure store: isSignedIn diventa false
          e il layout (home) reindirizza a /sign-in */}
      <TouchableOpacity style={ui.button} onPress={() => signOut()}>
        <Text style={ui.buttonText}>Esci</Text>
      </TouchableOpacity>
    </View>
  );
}
