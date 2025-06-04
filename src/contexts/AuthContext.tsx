import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

import { recoverPassword } from "@/services/auth/recoverPassword";
import { signIn } from "@/services/auth/signIn";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { getDeviceId } from "@/utils/deviceId";
import { getPushNotificationToken } from "@/utils/pushNotification";

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
        const userId = await AsyncStorage.getItem("userId");
        const authToken = await AsyncStorage.getItem("authToken");
        const buildingsList = await AsyncStorage.getItem("buildingsList");

        if (!userId || !authToken || !buildingsList) {
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

      await AsyncStorage.setItem("userId", data.user.id);
      await AsyncStorage.setItem("authToken", data.authToken);
      await AsyncStorage.setItem("buildingsList", JSON.stringify(data.user.UserBuildingsPermissions));

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
