import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Input } from "@rneui/themed";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ShowEntryScreen({ route }: { route: any }) {
  //props from navigation in photoentry screen
  const navigation = useNavigation();
  const { photoUrl, note, prompt } = route.params;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUrl }}
        style={[styles.avatar, styles.image, { width: 300, height: 300 }]}
      />
      {/* change the tags here */}
      <Text style={styles.textTitle}>Prompt</Text>
      <Text>{prompt}</Text>
      {note !== "" ? (
        <View>
          {" "}
          <Text style={styles.textTitle}>Note</Text>
          <Text>{note}</Text>
        </View>
      ) : (
        ""
      )}
      {/* <Input label="Prompt" value={prompt} disabled /> */}
      {/* <Input label="Note" value={note} disabled /> */}
      <Button title="Home" onPress={() => navigation.navigate("HomeMain")} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
  inputContainer: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  textTitle: {
    fontSize: 20,
  },
});
