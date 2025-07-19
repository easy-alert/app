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

import type { IAuthCompany } from "@/types/api/IAuthCompany";
import type { IAuthUser } from "@/types/api/IAuthUser";
import type { ISelectCompany } from "@/types/api/ISelectCompany";
import type { IListBuilding } from "@/types/utils/IListBuilding";
import type { MutationResponse } from "@/types/utils/MutationResponse";

interface AuthContextData {
  isAuthenticated: boolean;
  user: IAuthUser | null;
  company: IAuthCompany | null;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getBuildingPermissions: () => { id: string; name: string; nanoId: string }[];
  signIn: (
    login: string,
    password: string,
    companyId?: string,
  ) => Promise<{
    success: boolean;
    requiresCompanySelection: boolean;
    companies?: ISelectCompany[];
    login?: string;
    password?: string;
  }>;
  signOut: () => Promise<void>;
  recoverPassword: (email: string) => Promise<MutationResponse>;
}
const ADMIN_PERMISSION = "admin:company";

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [company, setCompany] = useState<IAuthCompany | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

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
    return user.UserBuildingsPermissions.map(({ Building }) => ({
      id: Building.id,
      name: Building.name,
      nanoId: Building.nanoId,
    }));
  };

  // Helper function to sign in
  const handleSignIn = async (login: string, password: string, companyId?: string) => {
    try {
      const pushNotificationToken = await getPushNotificationToken();
      const deviceId = await getDeviceId();

      const { success, message, data } = await signIn({
        login,
        password,
        companyId,
        pushNotificationToken,
        deviceId,
        os: Platform.OS,
      });

      if (!success) {
        setIsAuthenticated(false);
        alerts.error(message);
        return { success: false, requiresCompanySelection: false };
      }

      if ((data.companies?.length ?? 0) > 1 && !companyId) {
        return {
          success: true,
          requiresCompanySelection: true,
          companies: data.companies,
          login,
          password,
        };
      }

      const user = data.user;
      const company = data.company;
      const authToken = data.authToken;

      if (!company) {
        alerts.error("Nenhuma empresa encontrada para este usuário.");
        return { success: false, requiresCompanySelection: false };
      }

      await AsyncStorage.setItem(storageKeys.USER_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(storageKeys.COMPANY_KEY, JSON.stringify(company));

      await AsyncStorage.setItem(storageKeys.USER_ID_KEY, user.id);
      await AsyncStorage.setItem(storageKeys.COMPANY_ID_KEY, company.id);
      await AsyncStorage.setItem(storageKeys.AUTH_TOKEN_KEY, authToken);

      const buildingList: IListBuilding[] = user.UserBuildingsPermissions.map(({ Building }) => ({
        id: Building.id,
        name: Building.name,
        nanoId: Building.nanoId,
      }));

      await AsyncStorage.setItem(storageKeys.BUILDING_LIST_KEY, JSON.stringify(buildingList));

      setUser(user);
      setCompany(company);
      setIsAuthenticated(true);

      return { success: true, requiresCompanySelection: false };
    } catch (error) {
      console.error("Sign in error:", error);
      setIsAuthenticated(false);
      alerts.error("Ocorreu um erro ao fazer login. Tente novamente.");
      return { success: false, requiresCompanySelection: false };
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
    company,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getBuildingPermissions,
    signIn: handleSignIn,
    signOut,
    recoverPassword: handleRecoverPassword,
  };

  useEffect(() => {
    const verifyStorageAuth = async () => {
      try {
        const userId = await AsyncStorage.getItem(storageKeys.USER_ID_KEY);
        const companyId = await AsyncStorage.getItem(storageKeys.COMPANY_ID_KEY);
        const authToken = await AsyncStorage.getItem(storageKeys.AUTH_TOKEN_KEY);
        const buildingList = await AsyncStorage.getItem(storageKeys.BUILDING_LIST_KEY);

        if (!userId || !companyId || !authToken || !buildingList) {
          setIsAuthenticated(false);
          return;
        }

        const { exp: jwtExpiration } = jwtDecode(authToken);

        const isValidJwt = !!jwtExpiration && jwtExpiration * 1_000 > Date.now();

        if (!isValidJwt) {
          setIsAuthenticated(false);
          return;
        }

        const user = JSON.parse((await AsyncStorage.getItem(storageKeys.USER_KEY)) || "{}");
        const company = JSON.parse((await AsyncStorage.getItem(storageKeys.COMPANY_KEY)) || "{}");

        setUser(user);
        setCompany(company);
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
  const { isAuthenticated, user, company, ...rest } = useAuth();

  if (!isAuthenticated || !user || !company) {
    throw new Error("User must be authenticated");
  }

  return { user, company, isAuthenticated, ...rest };
};
