import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase, storeToken } from "../utils/supabase";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      const userToken = data.session.access_token;

      useEffect(() => {
        axios("http://localhost:8080/user", {
          method: "POST",
          headers: { Authorization: userToken },
        });
      });

      await storeToken(userToken);

      // Optional: Update user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_active: true })
        .eq("id", data.user.id);

      if (updateError) throw updateError;
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
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
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign In"
          loading={loading}
          onPress={signInWithEmail}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign Up"
          loading={loading}
          onPress={() => navigation.navigate("SignUp")}
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
