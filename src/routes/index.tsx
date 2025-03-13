import { Board } from "@pages/board";
import { Building } from "@pages/building";
import { Login } from "@pages/login";
import { Splash } from "@pages/splash";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
