import { Alert } from "react-native";

import type { IUser } from "@/types/api/IUser";
import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

interface IUserLogin {
  login: string;
  password: string;
  pushNotificationToken: string | null;
  deviceId: string | null;
  os: string;
}

// TODO: change to login
export const userLogin = async ({
  login,
  password,
  pushNotificationToken,
  deviceId,
  os,
}: IUserLogin): Promise<{
  user: IUser;
  authToken: string;
} | null> => {
  // TODO: essa validação não deve ser feita aqui, e sim anteriormente
  if (!login || !password) {
    alertMessage({
      type: "error",
      message: "Por favor, insira um número de telefone e senha válidos.",
    });

    return null;
  }

  // TODO: remover a barra
  const url = `/mobile/auth/login`;

  const body = {
    login,
    password,
    pushNotificationToken,
    deviceId,
    os,
  };

  try {
    const response = await baseApi.post(url, body);

    if (response.data.error) {
      Alert.alert("Erro", response.data.error);
      return null;
    }

    return response.data;
  } catch (error: any) {
    const response = error.response as ApiError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });

    return null;
  }
};
