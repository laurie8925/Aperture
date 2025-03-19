import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import StartingScreen from "../components/StartingScreen";
import SignUp from "../components/SignUp";
import HomeScreen from "../components/HomeScreen";
import AccountScreen from "../components/AccountScreen";
import Login from "../components/Login";
import PhotoEntryScreen from "../components/PhotoEntryScreen";

import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { onAuthChange } from "../utils/authEvent";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface AuthProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

function TabNavigator({ setIsAuthenticated }: AuthProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Account") iconName = "user";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#360C0C",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        children={(props) => (
          <AccountScreen setIsAuthenticated={setIsAuthenticated} />
        )}
      />
    </Tab.Navigator>
  );
}

function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Entry" component={PhotoEntryScreen} />
    </Stack.Navigator>
  );
}

function AuthStack({ setIsAuthenticated }: AuthProps) {
  return (
    <Stack.Navigator initialRouteName="StartingScreen">
      <Stack.Screen
        name="StartingScreen"
        component={StartingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        children={(props) => <Login setIsAuthenticated={setIsAuthenticated} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${backendUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err: unknown) {
      console.error(
        "Auth check failed:",
        err?.response?.data?.message || err.message
      );
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <TabNavigator setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <AuthStack setIsAuthenticated={setIsAuthenticated} />
      )}
    </NavigationContainer>
  );
}
