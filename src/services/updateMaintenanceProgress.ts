import { baseApi } from "./baseApi";

import type { IError } from "@/types/IError";

import { alertMessage, catchHandler } from "@/utils/handleAlerts";

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
}: IUpdateMaintenanceProgress) => {
  const uri = `company/maintenances/set/in-progress`;

  const params = {
    syndicNanoId,
  };

  const body = {
    userId,
    maintenanceHistoryId,
    inProgressChange,
  };

  try {
    const response = await baseApi.post(uri, body, { params });

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
};
