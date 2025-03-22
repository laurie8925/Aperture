import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PhotoList from "./PhotoList";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";

interface HomeScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text onPress={() => navigation.navigate("Entry")}>
        Go to Photo Entry
      </Text>
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
