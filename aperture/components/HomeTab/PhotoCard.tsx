import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import { Photo } from "../../types/types";

// define props
interface PhotoCardProps {
  photo: Photo;
  navigation: NavigationProp<RootStackParamList>;
}

function convertDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", day: "2-digit" });
}

const PhotoCard = ({ photo, navigation }: PhotoCardProps) => {
  return (
    <View>
      <Text style={styles.datestyle}>{convertDate(photo.date)}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ShowEntry", {
            photoUrl: photo.image_url,
            prompt: photo.prompt,
            note: photo.note || "",
            id: photo.id,
          })
        }
        style={styles.cardcontainer}
      >
        <View style={styles.rowContainer}>
          <Text style={styles.promptstyle}>{photo.prompt}</Text>
          {photo.image_url ? (
            <Image
              source={{ uri: photo.image_url }}
              style={{ width: 150, height: 130, borderRadius: 20 }}
            />
          ) : (
            ""
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   margin: 20,
  // },
  datestyle: {
    fontSize: 24,
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "PlayfairDisplayBold",
    paddingLeft: 20,
  },
  promptstyle: {
    fontSize: 18,
    color: "#360C0C",
    width: "49%",
    fontFamily: "RedHatDisplayMed",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  cardcontainer: {
    backgroundColor: "#F7EAD8",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default PhotoCard;
