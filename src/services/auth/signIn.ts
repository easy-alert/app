import { Alert } from "react-native";

import type { IUser } from "@/types/api/IUser";
import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "../baseApi";

interface ISignIn {
  phone: string;
  password: string;
  pushNotificationToken: string | null;
  deviceId: string | null;
  os: string;
}

export const signIn = async ({
  phone,
  password,
  pushNotificationToken,
  deviceId,
  os,
}: ISignIn): Promise<{
  user: IUser;
  authToken: string;
} | null> => {
  try {
    // TODO: essa validação não deve ser feita aqui, e sim anteriormente
    if (!phone || !password) {
      alertMessage({
        type: "error",
        message: "Por favor, insira um número de telefone e senha válidos.",
      });

      return null;
    }

    const body = {
      login: phone,
      password,
      pushNotificationToken,
      deviceId,
      os,
    };

    const response = await baseApi.post("/mobile/auth/login", body);

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
