import { Linking, Platform, Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import { PrimaryButton } from "@/components/Button";

import { styles } from "./styles";

export const AppUpdate = () => {
  const openStore = () => {
    try {
      if (Platform.OS === "ios") {
        Linking.openURL("https://apps.apple.com/br/app/id6738799449");
      } else if (Platform.OS === "android") {
        Linking.openURL("market://details?id=com.easyalert.app");
      }
    } catch {}
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="warning" size={58} color="#b21d1d" />
      <Text style={styles.mainLabel}>Seu app está desatualizado</Text>
      <Text style={styles.secondLabel}>
        Você está usando uma versão que não tem mais suporte, atualize e continue tendo acesso!
      </Text>

      <PrimaryButton
        onPress={openStore}
        label={Platform.OS === "android" ? "Ir para a Play Store" : "Ir para a App Store"}
        icon={
          <Ionicons
            name={Platform.OS === "android" ? "logo-google-playstore" : "logo-apple-appstore"}
            size={24}
            color="#fff"
          />
        }
      />
    </View>
  );
};
