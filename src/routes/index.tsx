import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { compare } from "compare-versions";
import * as Application from "expo-application";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { Splash } from "@/components/Splash";
import { useAuth } from "@/contexts/AuthContext";
import { AppUpdate } from "@/pages/AppUpdate";
import { CreateOccasionalMaintenance } from "@/pages/CreateOccasionalMaintenance";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Login } from "@/pages/Login";
import { MaintenanceDetails } from "@/pages/MaintenanceDetails";
import { Maintenances } from "@/pages/Maintenances";
import { getAppStableVersion } from "@/services/getAppStableVersion";

const Stack = createNativeStackNavigator();

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
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: __DEV__
      ? ["exp://127.0.0.1:8081/--/"] //
      : ["easyalert://", "https://company.easyalert.com.br/"],
    config: {
      screens: {
        Maintenances: {
          path: "maintenances",
          alias: ["*"],
        },
        CreateOccasionalMaintenance: "maintenances/new",
        MaintenanceDetails: "maintenances/:maintenanceId",
      },
      initialRouteName: "Maintenances",
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Maintenances" component={Maintenances} />
        <Stack.Screen name="CreateOccasionalMaintenance" component={CreateOccasionalMaintenance} />
        <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
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
