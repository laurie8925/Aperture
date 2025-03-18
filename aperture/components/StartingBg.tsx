import React from "react";
import { View, StyleSheet } from "react-native";

const Background = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#888E62",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

export default Background;
