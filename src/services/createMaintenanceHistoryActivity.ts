import { baseApi } from "./baseApi";

import { alertMessage, catchHandler } from "../utils/handleAlerts";

import type { IError } from "../types/IError";

interface ICreateMaintenanceHistoryActivity {
  maintenanceId: string;
  userId: string;
  content: string;
  uploadedFile?: { originalName: string; url: string | null; type: string }[];
}

export async function createMaintenanceHistoryActivity({
  maintenanceId,
  userId,
  content,
  uploadedFile,
}: ICreateMaintenanceHistoryActivity) {
  const uri = `company/maintenance-history-activities`;

  const body = {
    maintenanceHistoryId: maintenanceId,
    userId,
    content,
    images: uploadedFile,
  };

  try {
    const response = await baseApi.post(uri, body);

    alertMessage({
      type: "success",
      message: response?.data?.ServerMessage?.message,
    });
  } catch (error: any) {
    const response = error.response as IError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
      statusCode: response?.status,
    });
  }
}
