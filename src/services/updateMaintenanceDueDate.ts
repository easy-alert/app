import type { IError } from "@/types/IError";
import { alertMessage, catchHandler } from "@/utils/handleAlerts";

import { baseApi } from "./baseApi";

interface IUpdateMaintenanceDueDate {
  id: string;
  dueDate: string;
  status: string;
}

export const updateMaintenanceDueDate = async ({
  id,
  dueDate,
  status,
}: IUpdateMaintenanceDueDate): Promise<{ success: boolean }> => {
  const uri = `company/maintenances/history/edit`;

  const body = {
    maintenanceHistoryId: id,
    dueDate,
    maintenanceStatus: status,
    showToResident: true,
  };

  try {
    const response = await baseApi.put(uri, body);

    alertMessage({
      type: "success",
      message: response?.data?.ServerMessage?.message,
    });

    return { success: true };
  } catch (error: any) {
    const response = error.response as IError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });

    return { success: false };
  }
};
