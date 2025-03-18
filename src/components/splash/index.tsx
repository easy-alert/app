import React from "react";
import { View, Image } from "react-native";

import { styles } from "./styles";

import Logo from "@/assets/logo.png";

export const Splash = () => {
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
