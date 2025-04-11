import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Splash } from "@/components/Splash";
import { useAuth } from "@/contexts/AuthContext";
import { Buildings } from "@/pages/Buildings";
import { CreateOccasionalMaintenance } from "@/pages/CreateOccasionalMaintenance";
import { Login } from "@/pages/Login";
import { MaintenanceDetails } from "@/pages/MaintenanceDetails";
import { Maintenances } from "@/pages/Maintenances";

const Stack = createNativeStackNavigator();

export const Routes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <Splash />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: __DEV__
      ? ["exp://127.0.0.1:8081/--/"] //
      : ["easyalert://", "https://company.easyalert.com.br/"],
    config: {
      screens: {
        Buildings: "*",
        Maintenances: "maintenances",
        CreateOccasionalMaintenance: "buildings/:buildingId/maintenances/new",
        MaintenanceDetails: "maintenances/:maintenanceId",
      },
      initialRouteName: "Buildings",
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Buildings"
          component={Buildings}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Maintenances"
          component={Maintenances}
          options={{
            gestureEnabled: false,
          }}
        />

        <Stack.Screen name="CreateOccasionalMaintenance" component={CreateOccasionalMaintenance} />
        <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
