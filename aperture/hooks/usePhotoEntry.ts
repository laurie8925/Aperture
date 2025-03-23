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
  //get token, prompt, and prompt id
  //check if todayentry is submited
  const [token, setToken] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptId, setPromptId] = useState("");
  const [todayEntry, setTodayEntry] = useState(null);
  const [error, setError] = useState("");

  const checkTodayEntry = useCallback(
    async (currentPromptId: string) => {
      try {
        const storedToken = token;
        if (!storedToken) throw new Error("No token found.");

        const entryResponse = await axios.get(`${backendUrl}/photo/today`, {
          params: { prompt_id: currentPromptId },
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (entryResponse.data && entryResponse.data !== false) {
          setTodayEntry(entryResponse.data);
          return true;
        }
        return false;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        return false;
      }
    },
    [token]
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken)
          throw new Error("No token found. Please log in first.");
        setToken(storedToken);

        const promptResponse = await axios.get(`${backendUrl}/prompts/today`);
        if (!promptResponse.data || !promptResponse.data.id) {
          throw new Error("Failed to fetch prompt: No prompt ID found.");
        }
        setPromptId(promptResponse.data.id);
        setPrompt(promptResponse.data.prompt);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };
    initialize();
  }, [navigation]);

  useEffect(() => {
    if (promptId) {
      checkTodayEntry(promptId);
    }
  }, [promptId, checkTodayEntry]);

  return { token, prompt, promptId, todayEntry, checkTodayEntry };
};
