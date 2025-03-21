import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePhotoEntry } from "../hooks/usePhotoEntry";
import { RootStackParamList } from "../types/NavigationType";
import { NavigationProp } from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export default function PhotoList({ navigation }: Props) {
  const [photos, setPhotos] = useState([]);
  const { token } = usePhotoEntry(navigation);

  useEffect(() => {
    async function getPhotos() {
      try {
        const response = await axios.get(`${backendUrl}/photo/user/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPhotos(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error getting user photos:", error);
      }
    }
    getPhotos();
  }, []);
  return (
    <View>
      <FlatList
        data={photos}
        renderItem={({ item }) => <PhotoCard key={item.id} photo={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text>PhotoList</Text>
    </View>
  );
}
