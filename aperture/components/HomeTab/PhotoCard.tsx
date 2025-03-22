import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";

// define props
interface PhotoCardProps {
  photo: {
    id?: string;
    image_url: string;
    prompt_id: string;
    note?: string;
    date: string;
    prompt: string;
  };
  navigation: NavigationProp<RootStackParamList>;
  // onPress: () => void;
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
      {photo.image_url ? (
        <Image
          source={{ uri: photo.image_url }}
          style={{ width: 100, height: 100 }}
        />
      ) : (
        <Text>No Entry Yet</Text>
      )}
      <Text>{photo.prompt}</Text>
      {photo.note && <Text>{photo.note}</Text>}
    </View>
  </TouchableOpacity>
);

export default PhotoCard;
