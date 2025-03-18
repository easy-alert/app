import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { userLogin } from "@/services/userLogin";

interface AuthContextData {
  isAuthenticated: boolean | undefined;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

  useEffect(() => {
    const verifyStorageAuth = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const authToken = await AsyncStorage.getItem("authToken");
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        const buildingsList = await AsyncStorage.getItem("buildingsList");

        setIsAuthenticated(!!userId && !!authToken && !!phoneNumber && !!buildingsList);
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
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => useContext(AuthContext);
