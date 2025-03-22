import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePhotoEntry } from "../../hooks/usePhotoEntry";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import PhotoCard from "./PhotoCard";

interface PropmtCardProps {
  prompt: string;
  navigation: NavigationProp<RootStackParamList>;
}

const PromptCard = ({ prompt, navigation }: PropmtCardProps) => {
  return (
    <View>
      <Text>Today's Prompt</Text>
      <Text>{prompt}</Text>
    </View>
  );
};

export default PromptCard;
