import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ForgotPassword } from "@/pages/ForgotPassword";
import { Login } from "@/pages/Login";
import { LoginCompanySelection } from "@/pages/LoginCompanySelection";

const Stack = createNativeStackNavigator();

export const AuthRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="LoginCompanySelection"
          component={LoginCompanySelection}
          options={{
            headerShown: true,
            title: "Selecione a empresa",
          }}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
