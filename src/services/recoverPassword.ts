import { Alert } from "react-native";

import type { IError } from "@/types/IError";
import { catchHandler } from "@/utils/handleAlerts";

import { baseApi } from "./baseApi";

interface IRecoverPassword {
  email: string;
}

export const recoverPassword = async ({ email }: IRecoverPassword): Promise<{ success: boolean }> => {
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
    const response = error.response as IError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });

    return { success: false };
  }
};
