import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios"; // Import AxiosError
import { Button, Input } from "@rneui/themed";
import { supabase } from "../utils/supabase";

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        console.log("Token being sent:", token);

        const response = await axios.get(`${backendUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error: unknown) {
        // Type the error as AxiosError
        if (axios.isAxiosError(error)) {
          console.error(
            error.response?.data?.message || "Error fetching user data"
          );
          setError("Error getting user data");
        } else {
          console.error("Unexpected error:", error);
          setError("Unexpected error occurred");
        }
      }
    };

    getUserData();
  }, [setIsAuthenticated]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/login`,
        {
          email,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.data.token) {
        throw new Error("No token received");
      }

      const { token, user, refresh_token } = response.data;
      await AsyncStorage.setItem("token", token);
      console.log("Token saved:", token);

      if (user) {
        // If /login returns user data, use it directly
        console.log("User from login:", user);
        setUser(user);
        setIsAuthenticated(true);
        setError("");
      } else {
        // Otherwise, fetch from /user
        const userResponse = await axios.get(`${backendUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User response:", userResponse.data);
        setUser(userResponse.data.user);
        setIsAuthenticated(true);
        setError("");
      }
    } catch (error: unknown) {
      // Type as unknown
      // Type guard to check if it's an AxiosError
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || "Error logging in");
        setError(error.response?.data?.message || "Error logging in");
      } else {
        console.error("Unexpected error:", error);
        setError("Unexpected error occurred");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder="email"
        autoCapitalize="none"
        autoComplete="email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Input
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Login;
