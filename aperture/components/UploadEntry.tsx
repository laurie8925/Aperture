import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { StyleSheet, View, Alert, Image } from "react-native";
import { Button, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  promptId: string; // Add promptId as a prop
}

export default function PhotoEntryScreen({
  url,
  size = 150,
  onUpload,
  promptId,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    console.log("Initial url:", url);
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("user-photos")
        .getPublicUrl(path);

      if (error) throw error;
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Failed to load image", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];
      console.log(image);

      // Convert image to array buffer for upload
      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );
      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      // Upload image to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("user-photos")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      console.log("Upload response:", { data, error: uploadError });

      if (uploadError) {
        throw uploadError;
      }

      console.log("Upload successful, data:", data);

      // Update the UI with the new image
      await downloadImage(data.path);
      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Upload failed", error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View>
        <Button
          title={uploading ? "Uploading ..." : "Upload"}
          onPress={uploadAvatar}
          disabled={uploading}
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
});
