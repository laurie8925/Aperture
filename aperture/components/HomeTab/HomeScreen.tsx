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
  const name = auth.user?.name || "Guest";
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {name}!</Text>
        {/* <Text style={styles.subtitle}>Welcome, {name}!</Text> */}
      </View>
      <View style={styles.photolistContainer}>
        <PhotoList navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#F7EAD8",
  },
  header: {
    marginBottom: 40,
    marginLeft: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
    color: "#360C0C",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  photolistContainer: {
    backgroundColor: "#888E62",
    paddingTop: 50,
    paddingBottom: 150,
    borderRadius: 50,
  },
});
