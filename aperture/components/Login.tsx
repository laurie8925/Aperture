import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   const navigation = useNavigation(); // Corrected useNavigation usage

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://192.168.1.100:8080/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLoggedIn(true);
        setUser(response.data.user);
      } catch (err) {
        console.error(err?.response?.data?.message || "Error fetching user data");
        setError("Error getting user data");
      }
    };

    getUserData();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.78:8080/login", {
        email,
        password,
      },
      { headers: { "Content-Type": "application/json" } });

      console.log("Login response:", response.data); // Check API response

if (!response.data.token) {
  throw new Error("No token received");
}

      await AsyncStorage.setItem("token", response.data.token);

      const userResponse = await axios.get("http://192.168.1.78:8080/user", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      setLoggedIn(true);
      setUser(userResponse.data.user);
      setError("");

    //   navigation.navigate("Profile"); // Navigate to Profile screen after login
    } catch (err) {
        console.error("Login request failed:", err?.response?.data || err.message);
        setError(err?.response?.data?.message || "Error logging in");
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
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default Login;