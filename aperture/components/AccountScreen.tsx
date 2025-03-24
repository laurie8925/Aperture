import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { emitSignOut } from "../utils/authEvent";
import axios from "axios";
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
        <Text style={styles.title}>Account Details</Text>
      </View>

      <View style={styles.accountContainer}>
        <View style={styles.mb50}>
          <Text style={styles.subtitle}>Name</Text>
          <Text>{auth.user?.name}</Text>
        </View>
        <View style={styles.mb50}>
          <Text style={styles.subtitle}>Email</Text>
          <Text>{auth.user?.email}</Text>
        </View>
        <Button title="Sign Out" onPress={handleSignOut} />
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
    fontSize: 16,
    color: "#666",
  },
  accountContainer: {
    flex: 1,
    backgroundColor: "#888E62",
    paddingTop: 50,
    paddingBottom: 150,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
  },
  mb50: {
    marginBottom: 50,
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
});
