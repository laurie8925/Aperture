import { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Home: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  HomeMain: undefined;
  Entry: undefined;
  ShowEntry: {
    photoUrl: string;
    note: string;
    prompt: string;
  };
};

export type AuthStackParamList = {
  StartingScreen: undefined;
  LogIn: undefined;
  SignUp: undefined;
};
