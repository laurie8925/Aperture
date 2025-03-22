import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity, Image } from "react-native";

// define props
interface Props {
  photo: {
    id?: string;
    image_url: string;
    prompt_id: string;
    note?: string;
    date: string;
    prompt: string;
  };
  // onPress: () => void;
}

const PhotoCard = ({ photo }: Props) => (
  <TouchableOpacity>
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
