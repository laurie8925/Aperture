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
      <View style={styles.centerContainer}>
        <Text style={styles.textstyle}>Aperture</Text>
      </View>
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
    paddingTop: 15,
    backgroundColor: "#F7EAD8",
  },
  header: {
    // marginBottom: 40,
    marginLeft: 40,
  },
  title: {
    paddingVertical: 50,
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
  textstyle: {
    fontFamily: "PlayfairDisplayBold",
    fontSize: 20,
    textAlign: "center",
    color: "#360C0C",
  },
  centerContainer: {
    alignItems: "center",
  },
});
