import { baseApi } from "../baseApi";

import { unMaskBRL } from "../../utils/unMaskBRL";

import { alertMessage, catchHandler } from "../../utils/handleAlerts";

import type {
  IOccasionalMaintenanceData,
  IOccasionalMaintenanceType,
} from "../../types";
import type { IError } from "../../types/IError";

interface IRequestCreateOccasionalMaintenance {
  origin: string;
  userId: string;
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  occasionalMaintenanceBody: IOccasionalMaintenanceData;

  ticketsIds?: string[];
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
}: IRequestCreateOccasionalMaintenance) => {
  const uri = "company/buildings/reports/occasional/create";

  const body = {
    origin,
    occasionalMaintenanceType,
    buildingId: buildingId || null,
    executionDate:
      new Date(new Date(executionDate).setUTCHours(3, 0, 0, 0)) || null,
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
