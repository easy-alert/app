import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { alertCatchMessage } from "@/utils/alerts";

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
    const response = error.response as ApiMutationError;

    alertCatchMessage({
      message: response.data.ServerMessage.message,
    });

    return { success: false };
  }
};
