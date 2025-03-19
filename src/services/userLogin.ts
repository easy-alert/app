import { Alert } from "react-native";

import { baseApi } from "./baseApi";

import type { IError } from "@/types/IError";
import type { IUser } from "@/types/IUser";

import { alertMessage, catchHandler } from "@/utils/handleAlerts";

interface IUserLogin {
  login: string;
  password?: string;
}

export const userLogin = async ({
  login,
  password,
}: IUserLogin): Promise<{
  user: IUser;
  authToken: string;
}> => {
  if (!login || !password) {
    alertMessage({
      type: "error",
      message: "Por favor, insira um número de telefone e senha válidos.",
    });

    return { user: {} as IUser, authToken: "" };
  }

  const url = `/mobile/auth/login`;

  const body = {
    login,
    password,
  };

  try {
    const response = await baseApi.post(url, body);

    if (response.data.error) {
      Alert.alert("Erro", response.data.error);
      return { user: {} as IUser, authToken: "" };
    }

    return response.data;
  } catch (error: any) {
    const response = error.response as IError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
      statusCode: response?.status,
    });

    return { user: {} as IUser, authToken: "" };
  }
};
