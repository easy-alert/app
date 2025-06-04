import type { IAuthUser } from "@/types/api/IAuthUser";
import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { catchHandler } from "@/utils/alerts";

import { baseApi } from "../baseApi";

interface ISignIn {
  phone: string;
  password: string;
  pushNotificationToken: string | null;
  deviceId: string | null;
  os: string;
}

interface ISignInResponse {
  user: IAuthUser;
  authToken: string;
}

export const signIn = async ({
  phone,
  password,
  pushNotificationToken,
  deviceId,
  os,
}: ISignIn): Promise<MutationResponse<ISignInResponse>> => {
  try {
    const body = {
      login: phone,
      password,
      pushNotificationToken,
      deviceId,
      os,
    };

    const response = await baseApi.post<ISignInResponse>("/mobile/auth/login", body);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    catchHandler({
      message: response.data.ServerMessage.message,
    });

    return {
      success: false,
      data: null,
    };
  }
};
