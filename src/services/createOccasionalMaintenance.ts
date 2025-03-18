import { baseApi } from "./baseApi";

import type { IOccasionalMaintenanceType } from "@/types/IOccasionalMaintenanceType";
import type { IOccasionalMaintenanceData } from "@/types/IOccasionalMaintenanceData";
import type { IError } from "@/types/IError";

import { unMaskBRL } from "@/utils/unMaskBRL";
import { alertMessage, catchHandler } from "@/utils/handleAlerts";

interface ICreateOccasionalMaintenance {
  origin: string;
  userId: string;
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  occasionalMaintenanceBody: IOccasionalMaintenanceData;
}

export const createOccasionalMaintenance = async ({
  origin,
  userId,
  occasionalMaintenanceType,
  occasionalMaintenanceBody: {
    buildingId,
    executionDate,
    categoryData,
    reportData,
    inProgress,
    element,
    activity,
    responsible,
    priorityName,
  },
}: ICreateOccasionalMaintenance) => {
  const uri = "company/buildings/reports/occasional/create";

  const body = {
    origin,
    occasionalMaintenanceType,
    buildingId: buildingId || null,
    executionDate: new Date(new Date(executionDate).setUTCHours(3, 0, 0, 0)) || null,
    userId,
    priorityName: priorityName || "low",
    categoryData: {
      id: categoryData.id || null,
      name: categoryData.name || null,
    },
    maintenanceData: {
      element: element || null,
      activity: activity || null,
      responsible: responsible || null,
    },
    inProgress,
    reportData: {
      cost: unMaskBRL(reportData.cost) || null,
      observation: reportData.observation || null,
      files: reportData.files || null,
      images: reportData.images || null,
    },
  };

  try {
    const response = await baseApi.post(uri, body);

    alertMessage({
      type: "success",
      message: response?.data?.ServerMessage?.message,
    });

    return response.data;
  } catch (error: any) {
    const response = error.response as IError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
      statusCode: response?.status,
    });
  }
};
