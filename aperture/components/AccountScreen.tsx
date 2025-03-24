import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { AuthState } from "../hooks/useAuth";

interface AccountScreenProps {
  auth: AuthState;
}

export default function AccountScreen({ auth }: AccountScreenProps) {
  async function handleSignOut() {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Logout error:", auth.error);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.textstyle}>Aperture</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.accountContainer}>
        <View style={styles.mb50}>
          <Text style={styles.subtitle}>Name</Text>
          <Text style={styles.accounttext}>{auth.user?.name}</Text>
        </View>
        <View style={styles.mb50}>
          <Text style={styles.subtitle}>Email</Text>
          <Text style={styles.accounttext}>{auth.user?.email}</Text>
        </View>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#F7EAD8",
  },
  header: {
    // marginBottom: 40,
    marginLeft: 40,
  },
  title: {
    paddingVertical: 50,
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
    color: "#360C0C",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "PlayfairDisplayBold",
    color: "#fff",
  },
  accountContainer: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#888E62",
    paddingTop: 50,
    paddingBottom: 50,
    marginBottom: 100,
    borderRadius: 50,
    paddingHorizontal: 30,
  },
  mb50: {
    marginBottom: 30,
  },
  textstyle: {
    fontFamily: "PlayfairDisplayBold",
    fontSize: 20,
    textAlign: "center",
    color: "#360C0C",
  },
  centerContainer: {
    alignItems: "center",
  },
  backButton: {
    paddingLeft: 20,
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
    width: "100%",
  },
  labeltext: {
    fontSize: 18,
    fontFamily: "PlayfairDisplayBold",
    color: "#360C0C",
    width: "100%",
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#360C0C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#F7EAD8",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "PlayfairDisplayBold",
  },
  accounttext: {
    paddingVertical: 10,
    fontSize: 20,
    color: "#360C0C",
    fontFamily: "RedHatDisplayBold",
  },
});
