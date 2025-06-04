import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

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
}: ICreateMaintenanceHistoryActivity): Promise<void> => {
  try {
    const body = {
      maintenanceHistoryId: maintenanceId,
      userId,
      content,
      images: filesUploaded,
    };

    const response = await baseApi.post("/company/maintenance-history-activities", body);

    alertMessage({
      type: "success",
      message: response?.data?.ServerMessage?.message,
    });
  } catch (error: any) {
    const response = error.response as ApiError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });
  }
};
