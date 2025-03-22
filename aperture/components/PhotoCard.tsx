import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity, Image } from "react-native";

// define props
interface Props {
  photo: {
    id?: string;
    image_url?: string; // Changed from url to match PhotoList usage
    prompt_id?: string;
    note?: string;
    date?: string;
  };
  prompt: string;
  onPress: () => void;
}

const PhotoCard = ({ photo, prompt, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <View>
      {photo.image_url ? (
        <Image
          source={{ uri: photo.image_url }}
          style={{ width: 100, height: 100 }}
        />
      ) : (
        <Text>No Entry Yet</Text>
      )}
      <Text>{prompt}</Text>
      {photo.note && <Text>{photo.note}</Text>}
    </View>
  </TouchableOpacity>
);

export default PhotoCard;
