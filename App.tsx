import React from "react";
import { View, StyleSheet } from "react-native";
import { Board } from "./src/pages/board";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Splash } from "./src/pages/splash";
import { Login } from "./src/pages/login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.appContainer}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
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
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Define fundo branco global
  },
});
