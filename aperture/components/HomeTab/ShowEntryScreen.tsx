import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@rneui/themed";
import React from "react";
import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../../types/NavigationType";

interface Props {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "ShowEntry">;
}

export default function ShowEntryScreen({ route }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { photoUrl, note, prompt, id, date } = route.params; //props from navigation in photoentry screen
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="chevron-back" size={40} color="#888E62" />
      </TouchableOpacity>
      <Text style={styles.title}>{date}</Text>

      <View style={styles.promptContainer}>
        <Text style={styles.promptstyle}>{prompt}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photoUrl }}
            style={[styles.avatar, styles.image, { width: 300, height: 300 }]}
          />
        </View>
        {note !== "" ? (
          <View style={styles.labelContainer}>
            <Text style={styles.text}>Note</Text>
            <Text style={[styles.placeholder, styles.labeltext]}>{note}</Text>
          </View>
        ) : null}

        <Button
          title="Edit"
          onPress={() =>
            navigation.navigate("EditEntry", {
              photoUrl,
              note,
              prompt,
              id,
              date,
            })
          }
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        {/* <Button title="Home" onPress={() => navigation.navigate("Home")} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F7EAD8",
  },
  backButton: {
    paddingLeft: 20,
    alignSelf: "flex-start",
  },
  title: {
    paddingBottom: 20,
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
    color: "#360C0C",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  promptContainer: {
    backgroundColor: "#360C0C",
    borderRadius: 50,
    paddingHorizontal: 40,
    paddingVertical: 30,
    marginHorizontal: 20,
    zIndex: 1,
  },
  promptstyle: {
    color: "#F7EAD8",
    fontFamily: "RedHatDisplayMed",
    fontSize: 20,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#888E62",
    paddingTop: 60,
    paddingBottom: 150,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    marginTop: -30,
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 30,
  },
  noImage: {
    backgroundColor: "#F7EAD8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -10 }],
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 3,
  },
  uploadText: {
    textAlign: "center",
    marginTop: 10,
    color: "#007AFF",
    fontWeight: "bold",
  },
  imagestyle: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    marginVertical: 10,
  },
  button: {
    alignSelf: "center",
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
  placeholder: {
    backgroundColor: "#f6ebd9",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    fontFamily: "RedHatDisplayMed",
  },
  text: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
    width: "100%",
  },
  labeltext: {
    fontSize: 18,
    fontFamily: "PlayfairDisplayBold",
    color: "#360C0C",
    width: "100%",
  },
  labelContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
});
