import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export const setNotificationHandler = (): void => {
  if (!Device.isDevice) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

export const getPushNotificationToken = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    return null;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#b21d1d",
    });
  }

  const { granted } = await Notifications.getPermissionsAsync();

  if (!granted) {
    return null;
  }

  const projectId = Constants?.expoConfig?.extra?.eas.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

  return token;
};

export const requestPushNotificationPermissions = async (): Promise<void> => {
  try {
    if (!Device.isDevice) {
      return;
    }

    const { granted } = await Notifications.getPermissionsAsync();

    if (granted) {
      return;
    }

    await Notifications.requestPermissionsAsync();
  } catch {}
};
