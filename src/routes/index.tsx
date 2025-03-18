import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RouteList } from "./navigation";

import { Board } from "@/pages/board";
import { Building } from "@/pages/building";
import { Login } from "@/pages/login";
import { CreateOccasionalMaintenance } from "@/pages/createOccasionalMaintenance";
import { MaintenanceDetails } from "@/pages/maintenancesDetails";

const Stack = createNativeStackNavigator();

interface RoutesProps {
  initialRoute: RouteList;
}

export const Routes = ({ initialRoute }: RoutesProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            gestureEnabled: false,
          }}
        />

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
