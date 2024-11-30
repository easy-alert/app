import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkSyndicAndBuildingExists } from "../../services/checkSyndicAndBuildingExists";
import { syndicBuildings } from "../../types";
import Logo from "../../assets/logo.png";

export const Login = ({ navigation }: any) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Função para formatar o número de telefone
  const formatPhoneNumber = (value: string): string => {
    // Remove todos os caracteres que não sejam números
    const onlyNumbers = value.replace(/\D/g, "");

    // Formata o número de acordo com o padrão: (xx) 9 9999-9999
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
      const cleanedPhone = phoneNumber.replace(/\D/g, ""); // Remove os caracteres não numéricos antes de enviar
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

        navigation.replace("Board"); // Após autenticar, redireciona para a tela principal
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
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={Logo} // Certifique-se de que o caminho está correto
        style={styles.logo}
        resizeMode="contain" // Garante que a proporção da imagem seja mantida
      />

      {/* Título */}
      <Text style={styles.title}>Login</Text>

      {/* Input para número de telefone */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu número de telefone"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        maxLength={15} // Limita o número de caracteres ao tamanho da máscara
      />

      {/* Botão de Login */}
      {isLoggingIn ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2e2e", // Fundo cinza escuro
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150, // Ajuste o tamanho da logo
    height: 34,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#444",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#c62828",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
