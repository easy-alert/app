import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";

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
