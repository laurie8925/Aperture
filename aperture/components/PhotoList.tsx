import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePhotoEntry } from "../hooks/usePhotoEntry";
import { RootStackParamList } from "../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import { PhotoCard } from "./PhotoCard";

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export default function PhotoList({ navigation }: Props) {
  const [photos, setPhotos] = useState([]);
  const { token, prompt, promptId, todayEntry } = usePhotoEntry(navigation);

  useEffect(() => {
    async function getPhotos() {
      try {
        if (!token) return;
        const response = await axios.get(`${backendUrl}/photo/user/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Combine past entries with today's entry if it exists
        let allPhotos = response.data;
        if (todayEntry) {
          allPhotos = allPhotos.filter((photo) => photo.id !== todayEntry.id);
          allPhotos.unshift(todayEntry); // Put today's entry at the top
        }
        setPhotos(allPhotos);
      } catch (error) {
        console.error("Error getting user photos:", error);
      }
    }
    getPhotos();
  }, [token, todayEntry]);

  const handlePhotoPress = (photo) => {
    if (photo === todayEntry) {
      navigation.navigate("ShowEntry", {
        photoUrl: photo.image_url,
        note: photo.note || "",
        prompt: photo.prompt,
      });
    } else if (!todayEntry && photo.prompt_id === promptId) {
      // If no entry exists for today and this is today's prompt
      navigation.navigate("UploadEntry", { prompt, promptId });
    }
  };

  console.log("PhotoCard:", PhotoCard);
  const renderItem = ({ item }) => (
    <PhotoCard
      photo={item}
      prompt={item.prompt_id === promptId ? prompt : item.prompt}
      onPress={() => handlePhotoPress(item)}
    />
  );

  return (
    <View>
      {!todayEntry && (
        <View>
          <Text>Today's Prompt: {prompt}</Text>
          <PhotoCard
            photo={{ prompt_id: promptId }}
            prompt={prompt}
            onPress={() => handlePhotoPress({ prompt_id: promptId })}
          />
        </View>
      )}
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text>PhotoList</Text>
    </View>
  );
}
