/* FIXME:
- currently the name is ""
- update backend to get access to public user database for their name*/
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PhotoList from "./PhotoList";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import { AuthState, useAuth } from "../../hooks/useAuth";

interface HomeScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  // name: string;
  auth: AuthState;
}

export default function HomeScreen({ auth, navigation }: HomeScreenProps) {
  const name = auth.user?.name || "Guest"; //
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>Welcome, {name}!</Text>
      {/* <Text onPress={() => navigation.navigate("Entry")}>
        Go to Photo Entry
      </Text> */}
      <PhotoList navigation={navigation} />
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
