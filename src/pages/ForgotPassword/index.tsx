import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Keyboard } from "react-native";

import Logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { PublicNavigation } from "@/routes/navigation";

import { styles } from "./styles";

export const ForgotPassword = () => {
  const navigation = useNavigation<PublicNavigation>();
  const { recoverPassword } = useAuth();

  const [email, setEmail] = useState("");

  const [loading, setIsLoading] = useState(false);

  const handleRecoverPassword = async () => {
    Keyboard.dismiss();

    if (!email) {
      Alert.alert("Erro", "Por favor, insira um e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    setIsLoading(true);

    const { success } = await recoverPassword(email);

    if (success) {
      Alert.alert("Sucesso", "E-mail de recuperação de senha enviado com sucesso.");
      navigation.goBack();
    }

    setIsLoading(false);
  };

  return (
    <>
      <StatusBar translucent style="light" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Recuperar senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Informe o e-mail da sua conta"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleRecoverPassword}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.forgotPasswordText}>
            Já possui conta?{" "}
            <Text style={styles.forgotPasswordTextLink} onPress={navigation.goBack}>
              Faça login
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
