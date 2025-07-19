import type { IAuthCompany } from "@/types/api/IAuthCompany";
import type { IAuthUser } from "@/types/api/IAuthUser";
import type { ISelectCompany } from "@/types/api/ISelectCompany";
import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import type { MutationResponse } from "@/types/utils/MutationResponse";

import { baseApi } from "../baseApi";

interface ISignIn {
  login: string;
  password: string;
  companyId?: string;
  pushNotificationToken: string | null;
  deviceId: string | null;
  os: string;
}

interface ISignInResponse {
  authToken: string;
  company: IAuthCompany;
  companies?: ISelectCompany[];
  user: IAuthUser;
}

export const signIn = async ({
  login,
  password,
  companyId,
  pushNotificationToken,
  deviceId,
  os,
}: ISignIn): Promise<MutationResponse<ISignInResponse>> => {
  try {
    const body = {
      login,
      password,
      companyId,
      pushNotificationToken,
      deviceId,
      os,
    };

    const response = await baseApi.post<ISignInResponse>("/mobile/auth/login", body);

    return {
      success: true,
      message: "Login realizado com sucesso.",
      data: response.data,
    };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    return {
      success: false,
      message: response.data.ServerMessage.message,
      data: null,
    };
  }
};
