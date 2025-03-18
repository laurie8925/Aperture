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

// AppState.addEventListener("change", (state) => {
//   if (state === "active") {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.

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
