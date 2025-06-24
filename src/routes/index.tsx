import { compare } from "compare-versions";
import * as Application from "expo-application";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { AppUpdate } from "@/pages/AppUpdate";
import { Splash } from "@/pages/Splash";
import { getAppStableVersion } from "@/services/queries/getAppStableVersion";

import { AuthRoutes } from "./AuthRoutes";
import { MainRoutes } from "./MainRoutes";

export const Routes = () => {
  const { isAuthenticated } = useAuth();

  const [isStableVersion, setIsStableVersion] = useState<boolean>();

  useEffect(() => {
    const handleGetIsStableVersion = async () => {
      try {
        const isStableVersion = await getIsStableVersion();
        setIsStableVersion(isStableVersion);
      } catch {
        setIsStableVersion(true);
      }
    };

    handleGetIsStableVersion();
  }, []);

  if (isAuthenticated === undefined || isStableVersion === undefined) {
    return <Splash />;
  }

  if (!isStableVersion) {
    return <AppUpdate />;
  }

  if (!isAuthenticated) {
    return <AuthRoutes />;
  }

  return <MainRoutes />;
};

const getIsStableVersion = async () => {
  if (__DEV__ || Application.nativeBuildVersion === null) {
    return true;
  }

  const lastStableVersion = await getAppStableVersion();

  if (!lastStableVersion) {
    return true;
  }

  return Platform.OS === "android"
    ? parseInt(Application.nativeBuildVersion) >= lastStableVersion.android
    : compare(Application.nativeBuildVersion, lastStableVersion.ios, ">=");
};
