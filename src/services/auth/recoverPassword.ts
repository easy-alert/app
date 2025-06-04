import type { ApiError } from "@/types/utils/ApiError";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { catchHandler } from "@/utils/alerts";

import { baseApi } from "../baseApi";

interface IRecoverPassword {
  email: string;
}

export const recoverPassword = async ({ email }: IRecoverPassword): Promise<MutationResponse> => {
  try {
    const body = {
      email,
      link: "https://company.easyalert.com.br/passwordrecovery/change",
    };

    await baseApi.post("/company/passwordrecovery/sendemail", body);

    return { success: true };
  } catch (error: any) {
    const response = error.response as ApiError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });

    return { success: false };
  }
};
