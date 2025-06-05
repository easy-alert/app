import { Alert } from "react-native";

interface IAlertMessage {
  type: "error" | "success";
  message: string;
}

export const alertMessage = ({ type, message }: IAlertMessage): void => {
  switch (type) {
    case "error":
      Alert.alert("Erro", message);
      break;

    case "success":
      Alert.alert("Sucesso", message);
      break;
  }
};
