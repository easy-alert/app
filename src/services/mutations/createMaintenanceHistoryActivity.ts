import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { alertCatchMessage, alertMessage } from "@/utils/alerts";

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

    alertMessage({
      type: "success",
      message: response.data.ServerMessage.message,
    });

    return { success: true };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    alertCatchMessage({
      message: response.data.ServerMessage.message,
    });

    return { success: false };
  }
};
