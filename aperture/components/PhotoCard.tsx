import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity, Image } from "react-native";

// define props
interface Props {
  photo: {
    id: string;
    url?: string;
    prompt?: string;
    date: string;
  };
}

const PhotoCard = ({ photo, prompt, onPress }) => (
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
