import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import { recoverPassword } from "@/services/auth/recoverPassword";
import { signIn } from "@/services/auth/signIn";

import { alerts } from "@/utils/alerts";
import { getDeviceId } from "@/utils/deviceId";
import { getPushNotificationToken } from "@/utils/pushNotification";
import { storageKeys } from "@/utils/storageKeys";

import type { IAuthUser } from "@/types/api/IAuthUser";
import type { IUserBuildingPermission } from "@/types/api/IUserBuildingPermission";
import type { MutationResponse } from "@/types/utils/MutationResponse";

interface AuthContextData {
  isAuthenticated: boolean;
  user: IAuthUser | null;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getBuildingPermissions: () => { id: string; name: string; nanoId: string }[];
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  handleRecoverPassword: (email: string) => Promise<MutationResponse>;
}
const ADMIN_PERMISSION = "admin:company";

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [user, setUser] = useState<IAuthUser | null>(null);

  // Helper function to check permissions
  const isAdmin = (): boolean => {
    return user?.Permissions.some((p) => p.Permission.name === ADMIN_PERMISSION) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (isAdmin()) return true;
    return user.Permissions.some((p) => p.Permission.name === permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    if (isAdmin()) return true;
    return user.Permissions.some((p) => permissions.includes(p.Permission.name));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    if (isAdmin()) return true;
    return permissions.every((permission) => user.Permissions.some((p) => p.Permission.name === permission));
  };

  const getBuildingPermissions = (): { id: string; name: string; nanoId: string }[] => {
    if (!user) return [];
    return user.UserBuildingsPermissions.map((bp) => ({
      id: bp.Building.id,
      name: bp.Building.name,
      nanoId: bp.Building.nanoId,
    }));
  };

  // Helper function to sign in
  const handleSignIn = async (phone: string, password: string) => {
    try {
      const pushNotificationToken = await getPushNotificationToken();
      const deviceId = await getDeviceId();

      const { success, message, data } = await signIn({
        phone,
        password,
        pushNotificationToken,
        deviceId,
        os: Platform.OS,
      });

      if (!success) {
        setIsAuthenticated(false);
        alerts.error(message);
        return;
      }

      await AsyncStorage.setItem(storageKeys.USER_ID_KEY, data.user.id);
      await AsyncStorage.setItem(storageKeys.AUTH_TOKEN_KEY, data.authToken);

      const buildingList: IUserBuildingPermission[] = data.user.UserBuildingsPermissions;
      await AsyncStorage.setItem(storageKeys.BUILDING_LIST_KEY, JSON.stringify(buildingList));

      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Helper function to sign out
  const signOut = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.clear();
  };

  const handleRecoverPassword = (email: string) => recoverPassword({ email });

  const contextValue = {
    isAuthenticated: !!isAuthenticated,
    user,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getBuildingPermissions,
    signIn: handleSignIn,
    signOut,
    handleRecoverPassword,
  };

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

        setUser({
          id: userId,
          name: "",
          email: "",
          phoneNumber: "",
          isBlocked: false,
          isCompanyOwner: false,
          Permissions: [],
          UserBuildingsPermissions: [],
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifyStorageAuth();
  }, []);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const useRequiredAuth = () => {
  const { isAuthenticated, user, ...rest } = useAuth();

  if (!isAuthenticated || !user) {
    throw new Error("User must be authenticated");
  }

  return { user, isAuthenticated, ...rest };
};
