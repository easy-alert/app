import type { IError } from "@/types/IError";
import { alertMessage, catchHandler } from "@/utils/handleAlerts";

import { baseApi } from "./baseApi";

interface IUpdateMaintenanceDueDate {
  id: string;
  dueDate: string;
  status: string;
}

export const updateMaintenanceDueDate = async ({ id, dueDate, status }: IUpdateMaintenanceDueDate) => {
  const uri = `company/maintenances/history/edit`;

  const body = {
    id,
    dueDate,
    maintenanceStatus: status,
  };

  try {
    const response = await baseApi.put(uri, body);

    alertMessage({
      type: "success",
      message: response?.data?.ServerMessage?.message,
    });
  } catch (error: any) {
    const response = error.response as IError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });
  }
};
