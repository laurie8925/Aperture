import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import LogIn from "./Login";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";

const StartingScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  return (
    <View style={styles.container}>
      <Text>StartingScreen</Text>
      <View>
        <Button
          title="StartingScreen"
          onPress={() => navigation.navigate("LogIn")}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default StartingScreen;
