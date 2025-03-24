import { useState } from "react";
import { StyleSheet, View, Alert, Image, TouchableOpacity } from "react-native";
import { Button, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { supabase } from "../../utils/supabase";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/NavigationType";
import Icon from "react-native-vector-icons/MaterialIcons";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

type UploadEntryRouteProp = RouteProp<RootStackParamList, "UploadEntry">;

interface Props {
  navigation: NavigationProp<RootStackParamList>;
  route: UploadEntryRouteProp;
}

export default function UploadEntry({ navigation, route }: Props) {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Extract params from route
  const { token, promptId, prompt, size = 300 } = route.params; // size to 300 if not provided

  const photoSize = { height: size, width: size };

  async function uploadImage() {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

      //get publicurl
      const { data: publicUrlData } = supabase.storage
        .from("user-photos")
        .getPublicUrl(data.path);

      const imageUrl = publicUrlData.publicUrl;
      setPhotoUrl(imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload failed", String(error));
    } finally {
      setUploading(false);
    }
  }

  async function uploadDatabase() {
    if (!photoUrl) {
      Alert.alert("Error", "Please upload an image first");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/photo/add-photo`,
        {
          prompt_id: promptId,
          image_url: photoUrl,
          note: note || "No note provided",
          prompt: prompt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("uploadDatabase - Photo added:", response.data);

      navigation.navigate("ShowEntry", {
        photoUrl: photoUrl,
        note: note || "",
        prompt: prompt,
        id: response.data.data.id,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("uploadDatabase - Error:", error);
        Alert.alert("Submit failed", error.message);
      }
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
        <Icon name="arrow-back" size={40} color="#360C0C" />
      </TouchableOpacity>

      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          accessibilityLabel="Avatar"
          style={[photoSize, styles.avatar, styles.image]}
        />
      ) : (
        <View>
          <View style={[photoSize, styles.avatar, styles.noImage]} />
          <Button
            title={uploading ? "Uploading ..." : "Upload"}
            onPress={uploadImage}
            disabled={uploading}
          />
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
      <Button
        title={submitting ? "Submitting ..." : "Submit"}
        onPress={uploadDatabase}
        disabled={submitting || !photoUrl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    backgroundColor: "#F7EAD8",
  },
  backButton: {
    marginBottom: 20,
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
