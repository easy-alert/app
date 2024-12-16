import React from "react";
import { View, StyleSheet } from "react-native";
import { Board } from "./src/pages/board";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Splash } from "./src/pages/splash";
import { Login } from "./src/pages/login";
import { Building } from "./src/pages/building";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={styles.appContainer}>
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
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Define fundo branco global
  },
});
