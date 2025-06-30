import { DefaultTheme, LinkingOptions, NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MainLayout } from "@/layouts/MainLayout";
import { CreateOccasionalMaintenance } from "@/pages/CreateOccasionalMaintenance";
import { MaintenanceDetails } from "@/pages/MaintenanceDetails";
import { Maintenances } from "@/pages/Maintenances";

const Stack = createNativeStackNavigator();

export const MainRoutes = () => {
  const navigationTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: __DEV__
      ? ["exp://127.0.0.1:8081/--/"] //
      : ["easyalert://", "https://company.easyalert.com.br/maintenances"],
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
    <NavigationContainer linking={linking} theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        screenLayout={({ children }) => <MainLayout>{children}</MainLayout>}
      >
        <Stack.Screen name="Maintenances" component={Maintenances} />
        <Stack.Screen name="CreateOccasionalMaintenance" component={CreateOccasionalMaintenance} />
        <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
