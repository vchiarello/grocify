import { Show, useClerk, useUser } from "@clerk/expo";
import { UserButton, UserProfileView } from "@clerk/expo/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Home protetta: corrisponde alla rotta "/".
 * I gruppi tra parentesi non compaiono nell'URL, quindi (home)/index.tsx = "/".
 */
export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Show when="signed-in">
        <Text style={styles.text}>
          Hello {user?.emailAddresses[0].emailAddress}
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => signOut()}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
        </View>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <UserButton />
        </View>
        <UserProfileView style={{ flex: 1 }} />
      </Show>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 /* dice che il container occupa tutto lo spazio disponibile e ogni elemento occuperà lo stesso spazio */,
    justifyContent:
      "flex-start" /* allinea gli elementi all'inizio del contenitore lungo l'asse principale (verticale) */,
    flexDirection:
      "column" /* imposta la direzione degli elementi all'interno del contenitore come colonna (verticale) */,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
    padding: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    width: 150,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
