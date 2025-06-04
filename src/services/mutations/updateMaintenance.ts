import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { alertCatchMessage, alertMessage } from "@/utils/alerts";

import { baseApi } from "../baseApi";

interface IUpdateMaintenance {
  syndicNanoId: string;
  userId: string;
  maintenanceHistoryId: string;
  maintenanceReport: {
    cost: number;
    observation?: string;
  };
  files: {
    originalName: string;
    name: string;
    url: string;
  }[];
  images: {
    originalName: string;
    name: string;
    url: string;
  }[];
}

export const updateMaintenance = async ({
  syndicNanoId,
  userId,
  maintenanceReport,
  maintenanceHistoryId,
  files,
  images,
}: IUpdateMaintenance): Promise<MutationResponse> => {
  try {
    const params = {
      syndicNanoId,
    };

    const body = {
      userId,
      maintenanceHistoryId,
      cost: maintenanceReport.cost,
      observation: maintenanceReport.observation !== "" ? maintenanceReport.observation : null,
      ReportAnnexes: files,
      ReportImages: images,
    };

    const response = await baseApi.post<ApiMutationResponse>("/company/maintenances/create/report/progress", body, {
      params,
    });

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
