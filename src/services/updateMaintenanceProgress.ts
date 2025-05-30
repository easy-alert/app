import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

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
    const response = error.response as ApiError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });
  }
};
