import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Input } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../../types/NavigationType";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "EditEntry">;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export default function EditEntryScreen({ route }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    photoUrl: initialPhotoUrl,
    note: initialNote,
    prompt,
    id,
  } = route.params;

  const [note, setNote] = useState(initialNote || "");
  const [token, setToken] = useState("");
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadImage() {
    try {
      setUploading(true);
      const storedToken = await AsyncStorage.getItem("token"); //get token
      if (storedToken) {
        setToken(storedToken);
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 0.5,
        aspect: [1, 1],
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];
      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );
      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("user-photos")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData, error: urlError } = await supabase.storage
        .from("user-photos")
        .getPublicUrl(data.path);

      if (urlError) throw urlError;

      const newPhotoUrl = publicUrlData.publicUrl;
      setPhotoUrl(newPhotoUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image: " + String(error));
    } finally {
      setUploading(false);
    }
  }

  async function saveChanges() {
    try {
      setSubmitting(true);
      setError(null);

      const response = await axios.post(
        `${backendUrl}/photo/edit`,
        {
          id,
          note: note || "",
          image_url: photoUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        navigation.navigate("ShowEntry", {
          photoUrl,
          note,
          prompt,
          id,
        });
      }
    } catch (err) {
      console.error("Error updating photo entry:", err);
      setError(
        "Failed to save changes: " + (err.response?.data?.error || String(err))
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={{ uri: photoUrl }}
        style={[styles.avatar, styles.image, { width: 300, height: 300 }]}
      />

      <Button
        title={uploading ? "Uploading ..." : "Change Photo"}
        onPress={uploadImage}
        disabled={uploading || submitting}
        containerStyle={styles.buttonContainer}
      />

      <Text style={styles.textTitle}>Prompt</Text>
      <Text>{prompt}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.textTitle}>Note</Text>
        <Input
          value={note}
          onChangeText={setNote}
          placeholder="Enter your note here"
          multiline
          numberOfLines={4}
          disabled={submitting}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title={submitting ? "Saving ..." : "Save"}
        onPress={saveChanges}
        loading={submitting}
        disabled={submitting || uploading}
        containerStyle={styles.buttonContainer}
      />

      <Button
        title="Cancel"
        onPress={() => navigation.navigate("Home")}
        type="outline"
        containerStyle={styles.buttonContainer}
        disabled={submitting || uploading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  textTitle: {
    fontSize: 20,
    marginTop: 10,
  },
  inputContainer: {
    marginVertical: 15,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    marginVertical: 10,
  },
  backButton: {
    marginBottom: 20,
  },
});
