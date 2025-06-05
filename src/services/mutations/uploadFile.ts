import { ApiMutationError } from "@/types/utils/ApiMutationError";
import { MutationResponse } from "@/types/utils/MutationResponse";

import { baseApi } from "../baseApi";

interface IUploadFile {
  uri: string;
  type: string;
  name: string;
}

interface ApiResponse {
  Location: string;
}

interface IUploadFileResponse {
  url: string;
}

// TODO: verificar quando da erro
export const uploadFile = async ({ uri, type, name }: IUploadFile): Promise<MutationResponse<IUploadFileResponse>> => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri,
      type,
      name,
    } as any);

    const response = await baseApi.post<ApiResponse>("/company/upload/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: "Arquivo enviado com sucesso.",
      data: {
        url: response.data.Location,
      },
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
