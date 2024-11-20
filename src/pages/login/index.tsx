import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { styles } from "./styles";

import LogoEasy from "../../assets/logo-easy.svg";

export const Login = () => {
  const [phone, setPhone] = useState("");
  const logoUrl =
    "https://larguei.s3.us-west-2.amazonaws.com/LOGO_CASA_DO_SINDICO_AT-removebg-preview-1679072086766.png";

  const handlePhoneChange = (input: string) => {
    // Remove qualquer caractere não numérico
    const cleaned = input.replace(/\D/g, "");

    // Aplica a máscara usando regex
    const formatted = cleaned
      .replace(/^(\d{2})(\d)/, "($1) $2") // Coloca parênteses em torno dos dois primeiros dígitos
      .replace(/(\d{5})(\d)/, "$1-$2");

    setPhone(formatted);
  };

  const handlePressOut = () => {
    Alert.alert(
      "Atenção",
      "Você acessou o aplicativo com sucesso!",
      [{ text: "OK", onPress: () => console.log("OK Pressionado") }],
      { cancelable: false }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <LogoEasy width={250} height={150} style={styles.logo} />
          <Text style={styles.label}>Seu WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu número de celular"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={handlePhoneChange}
            maxLength={15} // Limita o número de caracteres para o formato (99) 99999-9999
          />
          <TouchableOpacity style={styles.button} onPressOut={handlePressOut}>
            <Text style={styles.button}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
