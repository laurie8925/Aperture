import { DeviceEventEmitter } from "react-native";

export const emitSignOut = () => {
  DeviceEventEmitter.emit("authChange");
};

export const onAuthChange = (callback: any) => {
  DeviceEventEmitter.addListener("authChange", callback);
};
