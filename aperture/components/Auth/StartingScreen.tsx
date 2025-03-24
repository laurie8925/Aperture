import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";

const StartingScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.centerContainer}>
        <Image
          style={styles.imagestyle}
          source={require("../../assets/camera-favicon-light.png")}
        />
        <Text style={styles.textstyle}>Aperture</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Let's get started!"
          onPress={() => navigation.navigate("LogIn")}
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
    alignItems: "center",
    backgroundColor: "#888E62",
  },
  centerContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 150,
  },
  textstyle: {
    fontFamily: "PlayfairDisplayBold",
    fontSize: 40,
    textAlign: "center",
    color: "#F7EAD8",
  },
  imagestyle: {
    width: 200,
    height: 200,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#360C0C",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 999,

    alignItems: "center",
  },
  buttonText: {
    color: "#F7EAD8",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "PlayfairDisplayBold",
  },
});

export default StartingScreen;
