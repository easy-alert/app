import { MaterialCommunityIcons } from "@expo/vector-icons";
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

import { styles } from "./styles";

export const Login = () => {
  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formatPhoneNumber = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, "");

    if (onlyNumbers.length > 10) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
        2,
        3,
      )} ${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7)}`;
    } else if (onlyNumbers.length > 6) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 6)}-${onlyNumbers.slice(6)}`;
    } else if (onlyNumbers.length > 2) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
    } else {
      return onlyNumbers;
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(formatPhoneNumber(value));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    Keyboard.dismiss(); // Fecha o teclado ao clicar no botão

    if (!phoneNumber || phoneNumber.length < 11) {
      Alert.alert("Erro", "Por favor, insira um número de telefone válido.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      await login(cleanedPhone, password);
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      Alert.alert("Erro", "Número inválido ou não cadastrado");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <StatusBar translucent style="light" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu número de telefone"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            maxLength={16}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha caso possua"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowPassword}
            />
          </View>

          {isLoggingIn ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
