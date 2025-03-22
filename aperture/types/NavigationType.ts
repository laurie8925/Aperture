import { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Home: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Entry: undefined;
  ShowEntry: {
    photoUrl: string;
    note: string;
    prompt: string;
  };
  UploadEntry: {
    prompt: string;
    promptId: string;
  };
};

export type AuthStackParamList = {
  StartingScreen: undefined;
  LogIn: undefined;
  SignUp: undefined;
};
