import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import React, { useState } from "react";
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
    date,
  } = route.params;

  const [note, setNote] = useState(initialNote || "");
  const [token, setToken] = useState("");
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoSize = { width: 300, height: 300 }; // Matches UploadEntry default

  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  async function uploadImage() {
    try {
      setUploading(true);
      const storedToken = await AsyncStorage.getItem("token");
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

      const { data: publicUrlData } = supabase.storage
        .from("user-photos")
        .getPublicUrl(data.path);

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
          date,
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
        <Ionicons name="chevron-back" size={40} color="#888E62" />
      </TouchableOpacity>

      <Text style={styles.title}>{date}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.promptContainer}>
          <Text style={styles.promptstyle}>{prompt}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: photoUrl }}
              style={[photoSize, styles.avatar]}
              accessibilityLabel="Photo to edit"
            />
            {uploading && (
              <Text style={styles.uploadingText}>Uploading ...</Text>
            )}
          </View>

          <Button
            title={uploading ? "Uploading ..." : "Change Photo"}
            onPress={uploadImage}
            disabled={uploading || submitting}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            containerStyle={styles.buttonContainer}
          />

          <View style={styles.inputContainer}>
            <Input
              style={[styles.placeholder, styles.labeltext]}
              label={
                <View style={styles.labelContainer}>
                  <Text style={styles.text}>Note</Text>
                </View>
              }
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
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            containerStyle={styles.buttonContainer}
          />

          <Button
            title="Cancel"
            onPress={() => navigation.navigate("Home")}
            type="outline"
            buttonStyle={styles.cancelButton}
            titleStyle={styles.cancelButtonText}
            containerStyle={styles.buttonContainer}
            disabled={submitting || uploading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F7EAD8",
  },
  scrollContent: {
    flexGrow: 1,
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
  cancelButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    width: 200,
    alignItems: "center",
    borderColor: "#360C0C",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: "#360C0C",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "PlayfairDisplayBold",
  },
  buttonContainer: {
    marginVertical: 10,
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
  errorText: {
    color: "red",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "RedHatDisplayMed",
  },
});
