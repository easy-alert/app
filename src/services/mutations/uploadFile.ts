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

// TODO: todo lugar que está chamando o upload file, caso de erro e retorne null, continua a operação sem verificar isso,
// precisamos verificar se deu algum erro antes de continuar
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
      data: {
        url: response.data.Location,
      },
    };
  } catch (error) {
    console.error("Erro ao realizar upload do arquivo:", error);

    return {
      success: false,
      data: null,
    };
  }
};
