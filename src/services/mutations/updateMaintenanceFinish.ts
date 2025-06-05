import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";

import { baseApi } from "../baseApi";

interface IUpdateMaintenanceFinish {
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

export const updateMaintenanceFinish = async ({
  syndicNanoId,
  userId,
  maintenanceHistoryId,
  maintenanceReport,
  files,
  images,
}: IUpdateMaintenanceFinish): Promise<MutationResponse> => {
  try {
    const body = {
      userId,
      responsibleSyndicId: syndicNanoId,
      maintenanceHistoryId,
      cost: maintenanceReport.cost,
      observation: maintenanceReport.observation !== "" ? maintenanceReport.observation : null,
      ReportAnnexes: files,
      ReportImages: images,
    };

    const response = await baseApi.post<ApiMutationResponse>("/company/maintenances/create/report", body);

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
