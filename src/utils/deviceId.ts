import * as Application from "expo-application";
import { Platform } from "react-native";

export const getDeviceId = async (): Promise<string | null> => {
  const deviceId = Platform.OS === "ios" ? await Application.getIosIdForVendorAsync() : Application.getAndroidId();
  return deviceId;
};
