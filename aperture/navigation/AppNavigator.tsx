import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartingScreen from "../components/Auth/StartingScreen";
import SignUp from "../components/Auth/SignUp";
import HomeScreen from "../components/HomeTab/HomeScreen";
import AccountScreen from "../components/AccountScreen";
import Login from "../components/Auth/Login";
import PhotoEntryScreen from "../components/HomeTab/PhotoEntryScreen";
import ShowEntryScreen from "../components/HomeTab/ShowEntryScreen";
import UploadEntry from "../components/HomeTab/UploadEntry";
import Icon from "react-native-vector-icons/FontAwesome";

import { useAuth, AuthState } from "../hooks/useAuth";

import { Dimensions } from "react-native";
import { View } from "react-native";
import {
  TabParamList,
  RootStackParamList,
  AuthStackParamList,
} from "../types/NavigationType";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface AuthProps {
  auth: AuthState;
}

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "";

function TabNavigator({ auth }: AuthProps) {
  const Tab = createBottomTabNavigator<TabParamList>();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...screenOptions,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Account") iconName = "user";

          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: "#F7EAD8",
        tabBarInactiveTintColor: "#888E62",
      })}
    >
      <Tab.Screen
        name="Home"
        children={() => <HomeNavigator auth={auth} />}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        children={(props) => <AccountScreen {...props} auth={auth} />}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function HomeNavigator({ auth }: AuthProps) {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        children={(props) => <HomeScreen {...props} auth={auth} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Entry"
        component={PhotoEntryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowEntry"
        component={ShowEntryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadEntry"
        component={UploadEntry}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthStack({ auth }: AuthProps) {
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
        children={(props) => <Login {...props} auth={auth} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        children={(props) => <SignUp {...props} auth={auth} />}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const auth = useAuth();
  useEffect(() => {
    console.log("Auth state:", {
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      token: auth.token,
    });
  }, [auth.isAuthenticated, auth.user, auth.token]);

  return (
    <NavigationContainer>
      {auth.isAuthenticated ? (
        <TabNavigator auth={auth} />
      ) : (
        <AuthStack auth={auth} />
      )}
    </NavigationContainer>
  );
}

const { width } = Dimensions.get("window");

const screenOptions = {
  tabBarStyle: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "#360C0C",
    borderRadius: 999,
    height: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabBarItemStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 10,
  },
  tabBarIconStyle: {
    alignSelf: "center",
    color: "#F7EAD8",
  },
};
