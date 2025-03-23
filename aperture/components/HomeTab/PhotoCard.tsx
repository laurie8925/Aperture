import { View, Text } from "react-native";
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

const PhotoCard = ({ photo, navigation }: PhotoCardProps) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate("ShowEntry", {
        photoUrl: photo.image_url,
        prompt: photo.prompt,
        note: photo.note || "",
      })
    }
  >
    <View>
      <Text>{photo.date}</Text>
      {photo.image_url ? (
        <Image
          source={{ uri: photo.image_url }}
          style={{ width: 100, height: 100 }}
        />
      ) : (
        ""
      )}
      <Text>Prompt: {photo.prompt}</Text>
      {photo.note && <Text>{photo.note}</Text>}
    </View>
  </TouchableOpacity>
);

export default PhotoCard;
