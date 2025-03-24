import React, { useState, useEffect } from "react";
import { Alert, View, StyleSheet, Text, Image } from "react-native";
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

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          style={styles.imagestyle}
          source={require("../../assets/camera-favicon-light.png")}
        />
        <Text style={styles.textstyle}>Aperture</Text>
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
      <View style={[styles.verticallySpaced, styles.mt10]}>
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
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#888E62",
    paddingHorizontal: 20,
  },
  verticallySpaced: {
    justifyContent: "center",
    alignItems: "center",
  },
  mt20: { marginTop: 20 },
  mt10: { marginTop: 10 },
  placeholder: {
    backgroundColor: "#f6ebd9",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    fontFamily: "RedHatDisplayMed",
  },
  text: {
    color: "#360C0C",
    fontSize: 17,
    fontFamily: "PlayfairDisplayBold",
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  centerContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  textstyle: {
    fontFamily: "PlayfairDisplayBold",
    fontSize: 30,
    textAlign: "center",
    color: "#F7EAD8",
  },
  button: {
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
  imagestyle: {
    width: 100,
    height: 100,
  },
});

export default Login;
