import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Maintenances } from "@/pages/Maintenances";
import { Buildings } from "@/pages/Buildings";
import { Login } from "@/pages/login";
import { CreateOccasionalMaintenance } from "@/pages/createOccasionalMaintenance";
import { MaintenanceDetails } from "@/pages/maintenancesDetails";
import { useAuth } from "@/contexts/authContext";
import { Splash } from "@/components/splash";

const Stack = createNativeStackNavigator();

export const Routes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <Splash />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <NavigationContainer>
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
