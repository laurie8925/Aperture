import React, { useState, useEffect } from "react";
import { Alert, View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "@rneui/themed";
import { AuthStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import { AuthState } from "../../hooks/useAuth";

interface LoginProps {
  auth: AuthState;
  navigation: NavigationProp<AuthStackParamList>;
}

const Login = ({ auth, navigation }: LoginProps) => {
  // const [user, setUser] = useState({});
  // const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

  async function signIn() {
    try {
      await auth.login(email, password);
    } catch (error: unknown) {
      Alert.alert("Error", auth.error || "Login failed");
    }
  }

  //   getUserData();
  // }, [setIsAuthenticated]);

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${backendUrl}/auth`,
  //       {
  //         email,
  //         password,
  //       },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     if (!response.data.token) {
  //       throw new Error("No token received");
  //     }

  //     const { token, user } = response.data;
  //     await AsyncStorage.setItem("token", token);
  //     console.log("Token saved:", token);

  //     if (user) {
  //       // If /login returns user data, use it directly
  //       console.log("User from login:", user);
  //       setUser(user);
  //       setIsAuthenticated(true);
  //       setError("");
  //     } else {
  //       // Otherwise, fetch from /user
  //       const userResponse = await axios.get(`${backendUrl}/user`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       console.log("User response:", userResponse.data);
  //       setUser(userResponse.data.user);
  //       setIsAuthenticated(true);
  //       setError("");
  //     }
  //   } catch (error: unknown) {
  //     // Type as unknown
  //     // Type guard to check if it's an AxiosError
  //     if (axios.isAxiosError(error)) {
  //       console.error(error.response?.data?.message || "Error logging in");
  //       setError(error.response?.data?.message || "Error logging in");
  //     } else {
  //       console.error("Unexpected error:", error);
  //       setError("Unexpected error occurred");
  //     }
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          style={[styles.placeholder, styles.text]}
          label={
            <View style={styles.labelContainer}>
              <Icon name="envelope" color="#360C0C" size={23} />
              <Text style={styles.text}>Email</Text>
            </View>
          }
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@email.com"
          placeholderTextColor="#c2b6b6"
          autoCapitalize="none"
          keyboardType="email-address"
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          style={[styles.placeholder, styles.text]}
          label={
            <View style={styles.labelContainer}>
              <Icon name="lock" color="#360C0C" size={30} />
              <Text style={styles.text}>Password</Text>
            </View>
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#c2b6b6"
          autoCapitalize="none"
          inputContainerStyle={{ borderBottomWidth: 0 }}
          // containerStyle={styles.inputContainer}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign In"
          onPress={signIn}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate("SignUp")}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#888E62" },
  verticallySpaced: {
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  mt20: { marginTop: 20 },
  placeholder: {
    backgroundColor: "#f6ebd9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  text: {
    color: "#360C0C",
    fontSize: 16,
    fontWeight: "bold",
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 10,
  },

  button: {
    backgroundColor: "#360C0C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: 200,
    alignItems: "center",
  },

  buttonText: {
    color: "#F7EAD8",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Login;
