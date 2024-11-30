import React, { useEffect } from "react";
import { View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";
import Logo from "../../assets/logo.png";

export const Splash = ({ navigation }: any) => {
  useEffect(() => {
    const getAsyncStorageVariable = async () => {
      const syndicNanoId = await AsyncStorage.getItem("syndicNanoId");
      const buildingNanoId = await AsyncStorage.getItem("buildingNanoId");

      if (syndicNanoId && buildingNanoId) {
        navigation.replace("Board");
      } else {
        navigation.replace("Login");
      }
    };
    setTimeout(() => {
      getAsyncStorageVariable();
    }, 2000); // Exibe a splash screen por 2 segundos
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={Logo} // Certifique-se de que o caminho está correto
        style={styles.logo}
        resizeMode="contain" // Garante que a proporção da imagem seja mantida
      />
    </View>
  );
};
