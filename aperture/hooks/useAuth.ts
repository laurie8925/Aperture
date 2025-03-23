import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { supabase } from "../utils/supabase";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

interface User {
  userId: string;
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
}

export const useAuth = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return {
    isAuthenticated,
  };
};
