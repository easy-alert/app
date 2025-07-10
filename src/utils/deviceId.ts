import { Platform } from "react-native";
import * as Application from "expo-application";

export const getDeviceId = async (): Promise<string | null> => {
  const deviceId = Platform.OS === "ios" ? await Application.getIosIdForVendorAsync() : Application.getAndroidId();
  return deviceId;
};
