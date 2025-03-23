/*TODO: 
- add "NAME" input for calling backend
- move supabase signUp call to backend
- call backend /user/signup with email, name, and password */

import React, { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "@rneui/themed";
import { AuthStackParamList } from "../../types/NavigationType";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/auth/signup`, {
        email,
        password,
        name,
      });

      const { data } = response;

      if (!data.session) {
        Alert.alert("Please check your inbox for email verification!");
      } else {
        Alert.alert("Success", "Signup successful!");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.error || error.response.data.message
        );
      } else if (error.request) {
        Alert.alert("Error", "No response from server");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
      navigation.navigate("LogIn");
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          style={[styles.placeholder, styles.text]}
          label={
            <View style={styles.labelContainer}>
              <Icon name="envelope" color="#360C0C" size={23} />
              <Text style={styles.text}>Name</Text>
            </View>
          }
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Bob"
          placeholderTextColor="#c2b6b6"
          autoCapitalize="words"
          // containerStyle={styles.inputContainer}
        />
      </View>
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
          // containerStyle={styles.inputContainer}
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
          // containerStyle={styles.inputContainer}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Sign Up"
          loading={loading}
          onPress={signUpWithEmail}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 12 },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
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
