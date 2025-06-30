import { Alert } from "react-native";

export const alerts = {
  error: (message: string) => Alert.alert("Erro", message),
};
