import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";

import { baseApi } from "../baseApi";

interface ICreateMaintenanceHistoryActivity {
  maintenanceId: string;
  userId: string;
  content: string;
  filesUploaded: {
    originalName: string;
    name: string;
    url: string;
  }[];
}

export const createMaintenanceHistoryActivity = async ({
  maintenanceId,
  userId,
  content,
  filesUploaded,
}: ICreateMaintenanceHistoryActivity): Promise<MutationResponse> => {
  try {
    const body = {
      maintenanceHistoryId: maintenanceId,
      userId,
      content,
      images: filesUploaded,
    };

    const response = await baseApi.post<ApiMutationResponse>("/company/maintenance-history-activities", body);

    return {
      success: true,
      message: response.data.ServerMessage.message,
    };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    return {
      success: false,
      message: response.data.ServerMessage.message,
    };
  }
};
