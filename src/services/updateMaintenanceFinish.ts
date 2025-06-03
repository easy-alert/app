import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

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
}: IUpdateMaintenanceFinish): Promise<void> => {
  const uri = `company/maintenances/create/report`;

  const body = {
    userId,
    responsibleSyndicId: syndicNanoId,
    maintenanceHistoryId,
    cost: maintenanceReport.cost,
    observation: maintenanceReport.observation !== "" ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  };

  try {
    const response = await baseApi.post(uri, body);

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
