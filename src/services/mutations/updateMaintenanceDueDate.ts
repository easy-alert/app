import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "../baseApi";

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
}: IUpdateMaintenanceDueDate): Promise<MutationResponse> => {
  try {
    const body = {
      maintenanceHistoryId: id,
      dueDate,
      maintenanceStatus: status,
      showToResident,
    };

    const response = await baseApi.put<ApiMutationResponse>("/company/maintenances/history/edit", body);

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
