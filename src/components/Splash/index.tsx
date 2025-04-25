import React from "react";
import { Image, View } from "react-native";

import Logo from "@/assets/logo.png";

import { styles } from "./styles";

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
