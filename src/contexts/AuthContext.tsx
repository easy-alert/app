import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

import { recoverPassword } from "@/services/auth/recoverPassword";
import { signIn } from "@/services/auth/signIn";
import { IBuilding } from "@/types/api/IBuilding";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { getDeviceId } from "@/utils/deviceId";
import { getPushNotificationToken } from "@/utils/pushNotification";
import { storageKeys } from "@/utils/storageKeys";

interface AuthContextData {
  isAuthenticated: boolean | undefined;
  userId: string;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  recoverPassword: (email: string) => Promise<MutationResponse>;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const verifyStorageAuth = async () => {
      try {
        const userId = await AsyncStorage.getItem(storageKeys.USER_ID_KEY);
        const authToken = await AsyncStorage.getItem(storageKeys.AUTH_TOKEN_KEY);
        const buildingList = await AsyncStorage.getItem(storageKeys.BUILDING_LIST_KEY);

        if (!userId || !authToken || !buildingList) {
          setIsAuthenticated(false);
          return;
        }

        const { exp: jwtExpiration } = jwtDecode(authToken);

        const isValidJwt = !!jwtExpiration && jwtExpiration * 1_000 > Date.now();

        if (!isValidJwt) {
          setIsAuthenticated(false);
          return;
        }

        setUserId(userId);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifyStorageAuth();
  }, []);

  const handleSignIn = async (phone: string, password: string) => {
    try {
      const pushNotificationToken = await getPushNotificationToken();
      const deviceId = await getDeviceId();

      const { success, data } = await signIn({
        phone,
        password,
        pushNotificationToken,
        deviceId,
        os: Platform.OS,
      });

      if (!success) {
        setIsAuthenticated(false);
        return;
      }

      await AsyncStorage.setItem(storageKeys.USER_ID_KEY, data.user.id);
      await AsyncStorage.setItem(storageKeys.AUTH_TOKEN_KEY, data.authToken);

      const buildingList: IBuilding[] = data.user.UserBuildingsPermissions.map((building) => building.Building);
      await AsyncStorage.setItem(storageKeys.BUILDING_LIST_KEY, JSON.stringify(buildingList));

      setUserId(data.user.id);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.clear();
  };

  const handleRecoverPassword = (email: string) => recoverPassword({ email });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId: userId || "",
        signIn: handleSignIn,
        signOut,
        recoverPassword: handleRecoverPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => useContext(AuthContext);
