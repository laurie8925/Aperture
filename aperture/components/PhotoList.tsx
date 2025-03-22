import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePhotoEntry } from "../hooks/usePhotoEntry";
import { RootStackParamList } from "../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import PhotoCard from "./PhotoCard";

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export default function PhotoList({ navigation }: Props) {
  const [photos, setPhotos] = useState([]);
  const { token, prompt } = usePhotoEntry(navigation);

  useEffect(() => {
    async function getPhotos() {
      try {
        if (!token) return;
        const response = await axios.get(`${backendUrl}/photo/user/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Combine past entries with today's entry if it exists
        let allPhotos = response.data;

        setPhotos(allPhotos);
      } catch (error) {
        console.error("Error getting user photos:", error);
      }
    }
    getPhotos();
  }, [token]);

  const handlePhotoPress = (photo) => {};

  console.log("PhotoCard:", PhotoCard);
  const renderItem = ({ item }) => (
    <PhotoCard
      photo={item}
      prompt={item.prompt}
      onPress={() => handlePhotoPress(item)}
    />
  );

  return (
    <View>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text>PhotoList</Text>
    </View>
  );
}
