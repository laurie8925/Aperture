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
    id: string;
    date: string;
  };
  UploadEntry: {
    token: string;
    prompt: string;
    promptId: string;
    size: number;
  };
  EditEntry: {
    photoUrl: string;
    note: string;
    prompt: string;
    id: string;
    date: string;
  };
};

export type AuthStackParamList = {
  StartingScreen: undefined;
  LogIn: undefined;
  SignUp: undefined;
};
