import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { emitSignOut } from "../utils/authEvent";
import axios from "axios";
import { AuthState } from "../hooks/useAuth";

interface AccountScreenProps {
  auth: AuthState;
}
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

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
      <Text>Profile Details</Text>
      <Text>Name</Text>
      <Text>{auth.user?.name}</Text>
      <Text>Email</Text>
      <Text>{auth.user?.email}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
