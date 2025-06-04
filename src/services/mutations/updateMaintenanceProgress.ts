import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "../baseApi";

interface IUpdateMaintenanceProgress {
  syndicNanoId: string;
  userId: string;
  maintenanceHistoryId: string;
  inProgressChange: boolean;
}

export const updateMaintenanceProgress = async ({
  syndicNanoId,
  userId,
  maintenanceHistoryId,
  inProgressChange,
}: IUpdateMaintenanceProgress): Promise<MutationResponse> => {
  try {
    const params = {
      syndicNanoId,
    };

    const body = {
      userId,
      maintenanceHistoryId,
      inProgressChange,
    };

    const response = await baseApi.post<ApiMutationResponse>("/company/maintenances/set/in-progress", body, { params });

    alertMessage({
      type: "success",
      message: response.data.ServerMessage.message,
    });

    return { success: true };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    catchHandler({
      message: response.data.ServerMessage.message,
    });

    return { success: false };
  }
};
