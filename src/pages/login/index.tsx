import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkSyndicAndBuildingExists } from "../../services/checkSyndicAndBuildingExists";
import { syndicBuildings } from "../../types";
import Logo from "../../assets/logo.png";
import { styles } from "./styles";

export const Login = ({ navigation }: any) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneNumber = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, "");
    if (onlyNumbers.length > 10) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
        2,
        3
      )} ${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
    } else if (onlyNumbers.length > 6) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
        2,
        6
      )}-${onlyNumbers.slice(6, 10)}`;
    } else if (onlyNumbers.length > 2) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
    } else {
      return onlyNumbers;
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(formatPhoneNumber(value));
  };

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      Alert.alert("Erro", "Por favor, insira um número de telefone válido.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const buildings: syndicBuildings[] = await checkSyndicAndBuildingExists(
        cleanedPhone
      );

      if (buildings) {
        await AsyncStorage.setItem("syndicNanoId", buildings[0].syndicNanoId);
        await AsyncStorage.setItem(
          "buildingNanoId",
          buildings[0].buildingNanoId
        );
        await AsyncStorage.setItem("buildingName", buildings[0].buildingName);
        await AsyncStorage.setItem("phoneNumber", phoneNumber);

        navigation.replace("Board");
      } else {
        Alert.alert("Erro", "Número de telefone inválido ou não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      Alert.alert("Erro", "Número inválido ou não cadastrado");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu número de telefone"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          maxLength={15}
        />

        {isLoggingIn ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
