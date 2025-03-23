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
  const handleSignOut = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        await axios.get(`${backendUrl}/user/logout`, {
          // Updated to /logout
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await AsyncStorage.removeItem("token");

      emitSignOut();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Error during sign-out:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
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
