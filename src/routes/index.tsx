import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Board } from "@/pages/board";
import { Building } from "@/pages/building";
import { Login } from "@/pages/login";
import { Splash } from "@/pages/splash";
import { CreateOccasionalMaintenance } from "@/pages/createOccasionalMaintenance";
import { MaintenanceDetails } from "@/pages/maintenancesDetails";

const Stack = createNativeStackNavigator();

export const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Building"
          component={Building}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Board"
          component={Board}
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
