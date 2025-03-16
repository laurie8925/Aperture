import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignIn from "../components/SignIn";
import StartingScreen from "../components/StartingScreen";
import SignUp from "../components/SignUp";
import HomeScreen from "../components/HomeScreen";
import AccountScreen from "../components/AccountScreen";
// import SettingsScreen from '../components/SettingsScreen';
import { Session } from "@supabase/supabase-js";
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

type AppNavigatorProps = {
  session: Session | null;
};

// Tab Navigator for logged-in users
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Account") iconName = "user";
          //   else if (route.name === 'Settings') iconName = 'cog';
          return <Icon name={iconName!} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#360C0C",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
}

// Stack Navigator for auth flow
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="StartingScreen">
      <Stack.Screen
        name="StartingScreen"
        component={StartingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
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

export default function AppNavigator({ session }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      {session ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
