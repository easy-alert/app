import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { userLogin } from "@/services/userLogin";

interface AuthContextData {
  isAuthenticated: boolean | undefined;
  userId: string;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        const buildingsList = await AsyncStorage.getItem("buildingsList");

        if (!userId || !authToken || !phoneNumber || !buildingsList) {
          setIsAuthenticated(false);
          return;
        }

        const { exp: jwtExpiration } = jwtDecode(authToken);

        const isValidJwt = !!jwtExpiration && jwtExpiration * 1000 > Date.now();

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

  const login = async (phone: string, password: string) => {
    try {
      const response = await userLogin({
        login: phone,
        password: password,
      });

      if (!response.user || !response.user.id) {
        setIsAuthenticated(false);
        return;
      }

      await AsyncStorage.setItem("userId", response.user.id);
      await AsyncStorage.setItem("authToken", response.authToken);

      await AsyncStorage.setItem("phoneNumber", phone);
      await AsyncStorage.setItem("buildingsList", JSON.stringify(response.user.UserBuildingsPermissions));

      setUserId(response.user.id);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId: userId || "",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => useContext(AuthContext);
