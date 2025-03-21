import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/NavigationType";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export const usePhotoEntry = (
  navigation: NavigationProp<RootStackParamList>
) => {
  const [token, setToken] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptId, setPromptId] = useState("");
  const [existingEntry, setExistingEntry] = useState(false);
  const [error, setError] = useState("");

  const checkEntry = useCallback(
    async (currentPromptId: string) => {
      try {
        const storedToken = token;
        if (!storedToken) throw new Error("No token found.");

        //get today's entry
        const entryResponse = await axios.get(`${backendUrl}/photo/today`, {
          params: { prompt_id: currentPromptId },
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        //if entry exist, then navigate to showentry
        if (entryResponse.data && entryResponse.data !== false) {
          setExistingEntry(true);
          navigation.navigate("ShowEntry", {
            photoUrl: entryResponse.data.image_url,
            note: entryResponse.data.note || "",
            prompt: prompt,
          });
          return true;
        } else {
          setExistingEntry(false);
          return false;
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          throw error;
        }
        return false;
      }
    },
    [navigation, token, prompt]
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        //get token
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken)
          throw new Error("No token found. Please log in first.");
        setToken(storedToken);

        //get prompt
        const promptResponse = await axios.get(`${backendUrl}/prompts/today`);
        console.log("Prompt API response:", promptResponse.data);
        if (!promptResponse.data || !promptResponse.data.id) {
          throw new Error("Failed to fetch prompt: No prompt ID found.");
        }
        setPromptId(promptResponse.data.id);
        setPrompt(promptResponse.data.prompt);

        //error
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Error in calling token and prompt for photoentry:",
            error.message
          );
          setError(error.message);
        } else {
          throw error;
        }
      }
    };
    initialize();
  }, [navigation]);

  //make sure checkEntry runs after setting states
  useEffect(() => {
    if (promptId) {
      checkEntry(promptId);
    }
  }, [promptId, checkEntry]);

  console.log(error);

  return { token, prompt, promptId, existingEntry, checkEntry };
};
