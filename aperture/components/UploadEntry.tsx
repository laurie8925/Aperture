import { useState } from "react";
import { StyleSheet, View, Alert, Image } from "react-native";
import { Button, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { supabase } from "../utils/supabase";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/NavigationType";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

interface Props {
  token: string;
  promptId: string;
  navigation: NavigationProp<RootStackParamList>;
  prompt: string;
  size: number;
}

export default function UploadEntry({
  token,
  promptId,
  navigation,
  prompt,
  size,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const photoSize = { height: size, width: size };

  async function uploadImage() {
    try {
      setUploading(true);

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

      const imageUrl = publicUrlData.publicUrl;
      setPhotoUrl(imageUrl);

      console.log("Image URL:", imageUrl);
    } catch (error) {
      console.error("Upload error:", error.message);
      Alert.alert("Upload failed", error.message);
    } finally {
      setUploading(false);
    }
  }

  async function uploadDatabase() {
    try {
      setSubmitting(true);
      console.log("uploadDatabase - Token:", token);
      console.log("uploadDatabase - Submitting with prompt_id:", promptId);
      const response = await axios.post(
        `${backendUrl}/photo/add-photo`,
        {
          prompt_id: promptId,
          image_url: photoUrl,
          note: note || "No note provided",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("uploadDatabase - Photo added:", response.data);

      navigation.replace("ShowEntry", {
        photoUrl: photoUrl || "",
        note: note || "",
        prompt: prompt,
      });
    } catch (error) {
      console.error(
        "uploadDatabase - Error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Submit failed",
        error.response?.data?.error || error.message
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <View>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          accessibilityLabel="Avatar"
          style={[photoSize, styles.avatar, styles.image]}
        />
      ) : (
        <View>
          <View style={[photoSize, styles.avatar, styles.noImage]} />
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
      <View>
        <Button
          title={submitting ? "Submitting ..." : "Submit"}
          onPress={uploadDatabase}
          disabled={submitting}
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
