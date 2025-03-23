import { View, Text, FlatList, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePhotoEntry } from "../../hooks/usePhotoEntry";
import { RootStackParamList } from "../../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";
import PhotoCard from "./PhotoCard";
import PromptCard from "./PromptCard";
import { Photo } from "../../types/types";

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export default function PhotoList({ navigation }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { prompt, token, todayEntry, promptId } = usePhotoEntry(navigation);

  useEffect(() => {
    async function getPhotos() {
      try {
        if (!token) return;
        const response = await axios.get(`${backendUrl}/photo/user/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPhotos: Photo[] = response.data.map((item: any) => ({
          id: item.id,
          image_url: item.image_url,
          prompt_id: item.prompt_id,
          note: item.note,
          date: item.date,
          prompt: item.prompt,
        }));

        setPhotos(allPhotos);
      } catch (error) {
        console.error("Error getting user photos:", error);
      }
    }
    getPhotos();
  }, [token]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
    >
      {todayEntry ? (
        photos.map((item) => (
          <PhotoCard photo={item} key={item.id} navigation={navigation} />
        ))
      ) : (
        <View>
          <PromptCard
            token={token}
            promptId={promptId}
            prompt={prompt}
            navigation={navigation}
          />
          {photos.map((item) => (
            <PhotoCard photo={item} key={item.id} navigation={navigation} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
