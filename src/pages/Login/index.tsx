import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Application from "expo-application";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { alerts } from "@/utils/alerts";
import { isEmail } from "@/utils/isEmail";
import { isPhone } from "@/utils/isPhone";

import { styles } from "./styles";

export const Login = () => {
  const navigation = useNavigation<PublicNavigation>();
  const { signIn } = useAuth();

  const [login, setLogin] = useState(""); // email or phone
  const [password, setPassword] = useState("");

  const [isSigninIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Format as phone if not email, else keep as is
  const formatPhoneBR = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleLoginChange = (value: string) => {
    // If user types @ or any letter, treat as email
    if (/[@a-zA-Z]/.test(value)) {
      setLogin(value);
    } else {
      setLogin(formatPhoneBR(value));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    Keyboard.dismiss();

    if (!login) {
      alerts.error("Por favor, insira seu e-mail ou número de telefone.");
      return;
    }

    if (!isEmail(login) && !isPhone(login)) {
      alerts.error("Por favor, insira um e-mail ou número de telefone válido.");
      return;
    }

    if (!password) {
      alerts.error("Por favor, insira uma senha válida.");
      return;
    }

    // If phone, clean it, else send as is
    const loginValue = isPhone(login) ? login.replace(/\D/g, "") : login;

    setIsSigningIn(true);
    await signIn(loginValue, password);
    setIsSigningIn(false);
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
            placeholder="Digite seu e-mail ou número de telefone"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={login}
            onChangeText={handleLoginChange}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
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

          <View style={styles.buttonContainer}>
            {isSigninIn ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInButtonText}>Entrar</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.forgotPasswordText}>
            Esqueceu sua senha?{" "}
            <Text style={styles.forgotPasswordTextLink} onPress={() => navigation.navigate("ForgotPassword")}>
              Recuperar senha
            </Text>
          </Text>

          <Text style={[styles.versionText]}>
            Versão {Application.nativeApplicationVersion} - {Application.nativeBuildVersion}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
