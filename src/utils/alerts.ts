import { Alert } from "react-native";

interface ICatchHandler {
  message: string;
}

interface IAlertMessage {
  type: "error" | "warning" | "info" | "success";
  message: string;
}

export const catchHandler = async ({ message }: ICatchHandler): Promise<void> => {
  const errorMessage = message || "Erro ao realizar a operação";

  Alert.alert("Erro", errorMessage);
};

export const alertMessage = async ({ type, message }: IAlertMessage): Promise<void> => {
  switch (type) {
    case "error":
      Alert.alert("Erro", message);
      break;

    case "warning":
      Alert.alert("Atenção", message);
      break;

    case "info":
      Alert.alert("Informação", message);
      break;

    case "success":
      Alert.alert("Sucesso", message);
      break;

    default:
      Alert.alert("Erro", "Erro ao exibir mensagem");
      break;
  }
};
