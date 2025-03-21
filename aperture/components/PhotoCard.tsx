import { View, Text } from "react-native";
import React from "react";

// define props
interface Props {
  photo: {
    id: string;
    url?: string;
    prompt?: string;
    date: string;
  };
}

export default function PhotoCard({ photo }: Props) {
  return (
    <View>
      <Text>PhotoCard</Text>
      {photo.prompt && <Text>{photo.prompt}</Text>}
    </View>
  );
}
