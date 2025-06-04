import { Alert } from "react-native";

import type { ApiError } from "@/types/utils/ApiError";
import { catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

interface IRecoverPassword {
  email: string;
}

export const recoverPassword = async ({ email }: IRecoverPassword): Promise<{ success: boolean }> => {
  // TODO: remover a barra
  const url = `/company/passwordrecovery/sendemail`;

  const body = {
    email,
    link: "https://company.easyalert.com.br/passwordrecovery/change",
  };

  try {
    const response = await baseApi.post(url, body);

    if (response.data.error) {
      Alert.alert("Erro", response.data.error);
      return { success: false };
    }

    return { success: true };
  } catch (error: any) {
    const response = error.response as ApiError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });

    return { success: false };
  }
};
