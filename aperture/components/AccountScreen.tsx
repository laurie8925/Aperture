import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { emitSignOut } from "../utils/authEvent";
import axios from "axios";

interface AccountProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export default function AccountScreen({ setIsAuthenticated }: AccountProps) {
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Clear the token

      await axios.get(`${backendUrl}/user/logout`); //update profile table

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
