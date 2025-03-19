import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { StyleSheet, View, Alert, Image } from "react-native";
import { Button, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

interface Props {
  size: number;
  url: string | null;
}

export default function PhotoEntryScreen({ url, size = 150 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [note, setNote] = useState(""); // Add state for note
  const [token, setToken] = useState(""); // Add state for token
  const [prompt, setPrompt] = useState(""); // Add state for token
  const [promptId, setPromptId] = useState(""); // Add state for token
  const avatarSize = { height: size, width: size };

  // Fetch the token when the component mounts
  useEffect(() => {
    // Get the token from Supabase session
    const getTokenAndPrompt = async () => {
      try {
        // get seesion for toekn
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          return;
        }
        setToken(storedToken);
        // PROMPTS
        const promptResponse = await axios.get(`${backendUrl}/prompts/today`); // Updated endpoint

        // Check if the response contains the expected data
        if (!promptResponse.data || !promptResponse.data.id) {
          throw new Error(
            "Failed to fetch prompt: No prompt ID found in response"
          );
        }

        setToken(storedToken);
        setPromptId(promptResponse.data.id);
        setPrompt(promptResponse.data.prompt);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching token or prompt:", error.message);
          Alert.alert("Error", error.message);
        }
      }
    };

    getTokenAndPrompt();
  }, [url]);

  async function uploadImage() {
    try {
      setUploading(true);

      if (!token) {
        throw new Error("No token available. Please log in again.");
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

      // config img for storage
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

      console.log("Upload response:", { data, error: uploadError });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData, error: urlError } = await supabase.storage
        .from("user-photos")
        .getPublicUrl(data.path);

      if (urlError) {
        throw urlError;
      }

      const imageUrl = publicUrlData.publicUrl;
      console.log("Image URL:", imageUrl);

      setPhotoUrl(imageUrl);

      // Log the values before making the request
      console.log("Making request to /photo/add-photo with:");
      console.log("Token:", token);
      console.log("Prompt ID:", prompt);
      console.log("Image URL:", imageUrl);
      console.log("Note:", note || "No note provided");
      console.log("Request Body:", {
        prompt_id: promptId,
        image_url: imageUrl,
        note: note || "No note provided",
      });

      const response = await axios.post(
        `${backendUrl}/photo/add-photo`,
        {
          prompt_id: promptId,
          image_url: imageUrl,
          note: note || "No note provided",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Photo added to database:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        Alert.alert(
          "Upload failed",
          `Server error: ${error.response.data.error || error.message}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        Alert.alert(
          "Upload failed",
          "No response from server. Check your network connection."
        );
      } else {
        console.error("Request setup error:", error.message);
        Alert.alert("Upload failed", error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View>
          <View style={[avatarSize, styles.avatar, styles.noImage]} />
          <View>
            <Button
              title={uploading ? "Uploading ..." : "Upload"}
              onPress={uploadImage}
              disabled={uploading}
            />
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Input
          label="Note"
          value={note}
          onChangeText={(text) => setNote(text)}
          placeholder="Add a note for this photo"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
  inputContainer: {
    marginVertical: 10,
  },
});
