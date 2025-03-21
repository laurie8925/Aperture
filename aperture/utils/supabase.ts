import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Use native AsyncStorage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // No URL handling on Android
  },
});

//token management
export const storeToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync("userToken", token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("userToken");
};

export const deleteToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("userToken");
};
