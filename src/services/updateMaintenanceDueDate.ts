import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

interface IUpdateMaintenanceDueDate {
  id: string;
  dueDate: string;
  status: string;
  showToResident: boolean;
}

export const updateMaintenanceDueDate = async ({
  id,
  dueDate,
  status,
  showToResident,
}: IUpdateMaintenanceDueDate): Promise<{ success: boolean }> => {
  const uri = `company/maintenances/history/edit`;

  const body = {
    maintenanceHistoryId: id,
    dueDate,
    maintenanceStatus: status,
    showToResident,
  };

  try {
    const response = await baseApi.put(uri, body);

    alertMessage({
      type: "success",
      message: response?.data?.ServerMessage?.message,
    });

    return { success: true };
  } catch (error: any) {
    const response = error.response as ApiError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });

    return { success: false };
  }
};
