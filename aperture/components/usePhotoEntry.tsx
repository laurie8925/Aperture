import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export const usePhotoEntry = (navigation) => {
  const [token, setToken] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptId, setPromptId] = useState("");
  const [existingEntry, setExistingEntry] = useState(false);

  const checkEntry = useCallback(
    async (currentPromptId) => {
      try {
        const storedToken = token || (await AsyncStorage.getItem("token"));
        if (!storedToken) {
          throw new Error("No token found. Please log in.");
        }

        const entryResponse = await axios.get(`${backendUrl}/photo/today`, {
          params: { prompt_id: currentPromptId },
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        console.log(`checkEntry - entryResponse.data:`, entryResponse.data);
        if (entryResponse.data && entryResponse.data !== false) {
          console.log(`checkEntry - Entry found, navigating to ShowEntry`);
          setExistingEntry(true);
          navigation.navigate("ShowEntry", {
            photoUrl: entryResponse.data.image_url,
            note: entryResponse.data.note || "",
            prompt: prompt,
          });
          return true;
        } else {
          console.log(`checkEntry - No entry found, staying on UploadEntry`);
          setExistingEntry(false);
          return false;
        }
      } catch (error) {
        console.error(`checkEntry - Error:`, error.message);
        if (error.response) {
          console.error(`checkEntry - Response data:`, error.response.data);
        }
        Alert.alert("Error", error.message);
        return false;
      }
    },
    [navigation, token]
  );

  useEffect(() => {
    console.log("useEffect running");
    const initialize = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          throw new Error("No token found. Please log in.");
        }
        setToken(storedToken);

        const promptResponse = await axios.get(`${backendUrl}/prompts/today`);
        if (!promptResponse.data || !promptResponse.data.id) {
          throw new Error("Failed to fetch prompt: No prompt ID found.");
        }
        const newPromptId = promptResponse.data.id;
        setPromptId(newPromptId);
        setPrompt(promptResponse.data.prompt);

        await checkEntry(newPromptId);
      } catch (error) {
        console.error("Error in usePhotoEntry:", error.message);
        Alert.alert("Error", error.message);
      }
    };

    initialize();
  }, [navigation, checkEntry]);

  return { token, prompt, promptId, existingEntry, checkEntry };
};
