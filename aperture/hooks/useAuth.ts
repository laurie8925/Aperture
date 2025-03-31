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
  user: User | null;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //call this first always
    const firstAuthCall = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token"); //get token
        if (storedToken) {
          setToken(storedToken);
          const response = await axios.get(`${backendUrl}/user`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          if (response.data.user) {
            setUser({
              userId: response.data.user.userId,
              email: response.data.user.email,
              name: response.data.user.name,
            });
            setIsAuthenticated(true);
          } else {
            throw new Error("Invalid user data");
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Login error");
        }
        throw error;
      }
    };
    firstAuthCall();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const response = await axios.post(`${backendUrl}/auth/signup`, {
        email,
        password,
        name,
      });

      if (response.status === 200 && !response.data.session) {
        setError(response.data.message);
      } else if (response.data.error) {
        throw new Error(response.data.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Signup error");
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post(`${backendUrl}/auth`, {
        email,
        password,
      });
      const { token } = response.data;
      if (!token) throw new Error("No token received");

      await AsyncStorage.setItem("token", token);
      setToken(token);

      const userresponse = await axios.get(`${backendUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        userId: userresponse.data.user.userId,
        email: userresponse.data.user.email,
        name: userresponse.data.user.name,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Login failed");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      if (token) {
        await axios.get(`${backendUrl}/user/logout`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Logout failed");
      }
    }
  };

  return {
    isAuthenticated,
    user,
    token,
    error,
    login,
    signup,
    logout,
  };
};
