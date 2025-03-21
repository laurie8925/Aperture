import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { NavigationProp } from "@react-navigation/native";
// import { RootStackParamList } from "../types/NavigationType";

import StartingScreen from "../components/Auth/StartingScreen";
import SignUp from "../components/Auth/SignUp";
import HomeScreen from "../components/HomeTab/HomeScreen";
import AccountScreen from "../components/AccountScreen";
import Login from "../components/Auth/Login";
import PhotoEntryScreen from "../components/HomeTab/PhotoEntryScreen";
import ShowEntryScreen from "../components/HomeTab/ShowEntryScreen";
import UploadEntry from "../components/HomeTab/UploadEntry";

import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  TabParamList,
  RootStackParamList,
  AuthStackParamList,
} from "../types/NavigationType";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface AuthProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

function TabNavigator({ setIsAuthenticated }: AuthProps) {
  const Tab = createBottomTabNavigator<TabParamList>();
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
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Entry" component={PhotoEntryScreen} />
      <Stack.Screen name="ShowEntry" component={ShowEntryScreen} />
      <Stack.Screen name="UploadEntry" component={UploadEntry} />
    </Stack.Navigator>
  );
}

function AuthStack({ setIsAuthenticated }: AuthProps) {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  return (
    <Stack.Navigator initialRouteName="StartingScreen">
      <Stack.Screen
        name="StartingScreen"
        component={StartingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogIn"
        children={({ navigation }) => (
          <Login
            setIsAuthenticated={setIsAuthenticated}
            navigation={navigation}
          />
        )}
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
