import { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { supabase } from "../../utils/supabase";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/NavigationType";

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
  const { token, promptId, prompt, size = 300 } = route.params;

  const photoSize = { height: size, width: size };

  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  async function uploadImage() {
    try {
      setUploading(true);

      // Request permission if not already granted
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow access to your photos.");
        return;
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
        console.log("Upload canceled by user");
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

      const { data: publicUrlData } = supabase.storage
        .from("user-photos")
        .getPublicUrl(data.path);

      const imageUrl = publicUrlData.publicUrl;
      setPhotoUrl(imageUrl);
      console.log("Photo uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Failed", String(error));
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

      navigation.navigate("ShowEntry", {
        photoUrl: photoUrl,
        note: note || "",
        prompt: prompt,
        id: response.data.data.id,
      });
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert(
        "Submit Failed",
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={40} color="#888E62" />
      </TouchableOpacity>

      <Text style={styles.title}>{todayDate}</Text>

      <View style={styles.promptContainer}>
        <Text style={styles.promptstyle}>{prompt}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.photoContainer}>
          {photoUrl ? (
            <TouchableOpacity
              onPress={uploadImage}
              disabled={uploading}
              activeOpacity={0.7} // Visual feedback on press
            >
              <Image
                source={{ uri: photoUrl }}
                accessibilityLabel="Tap to upload a new photo"
                style={[photoSize, styles.avatar]}
              />
              {uploading && (
                <Text style={styles.uploadingText}>Uploading ...</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                onPress={uploadImage}
                disabled={uploading}
                activeOpacity={0.7}
              >
                <View style={[photoSize, styles.avatar, styles.noImage]}>
                  <Image
                    style={styles.imagestyle}
                    source={require("../../assets/camera-favicon.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Input
            style={[styles.placeholder, styles.labeltext]}
            label={
              <View style={styles.labelContainer}>
                <Text style={styles.text}>Note</Text>
              </View>
            }
            value={note}
            onChangeText={(text) => setNote(text)}
            placeholder="Add a note for this photo"
          />
        </View>

        <Button
          title={submitting ? "Submitting ..." : "Submit"}
          onPress={uploadDatabase}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F7EAD8",
  },
  backButton: {
    paddingLeft: 20,
    alignSelf: "flex-start",
  },
  title: {
    paddingBottom: 20,
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
    color: "#360C0C",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  promptContainer: {
    backgroundColor: "#360C0C",
    borderRadius: 50,
    paddingHorizontal: 40,
    paddingVertical: 30,
    marginHorizontal: 20,
    zIndex: 1,
  },
  promptstyle: {
    color: "#F7EAD8",
    fontFamily: "RedHatDisplayMed",
    fontSize: 20,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#888E62",
    paddingTop: 60,
    paddingBottom: 150,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    marginTop: -30,
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 30,
  },
  noImage: {
    backgroundColor: "#F7EAD8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -10 }],
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 3,
  },
  uploadText: {
    textAlign: "center",
    marginTop: 10,
    color: "#007AFF",
    fontWeight: "bold",
  },
  imagestyle: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    marginVertical: 10,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#360C0C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#F7EAD8",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "PlayfairDisplayBold",
  },
  placeholder: {
    backgroundColor: "#f6ebd9",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    fontFamily: "RedHatDisplayMed",
  },
  text: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
  },
  labeltext: {
    fontSize: 18,
    fontFamily: "PlayfairDisplayBold",
    color: "#360C0C",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
});
