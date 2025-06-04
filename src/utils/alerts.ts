import { Alert } from "react-native";

interface IAlertCatchMessage {
  message?: string;
}

export const alertCatchMessage = ({ message = "Erro ao realizar a operação" }: IAlertCatchMessage): void => {
  alertMessage({
    type: "error",
    message,
  });
};

interface IAlertMessage {
  type: "error" | "warning" | "info" | "success";
  message: string;
}

export const alertMessage = ({ type, message }: IAlertMessage): void => {
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
  }
};
