import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { alertCatchMessage, alertMessage } from "@/utils/alerts";
import { unMaskBRL } from "@/utils/unMaskBRL";

import { baseApi } from "../baseApi";

interface IOccasionalMaintenanceData {
  buildingId: string;

  element: string;
  activity: string;
  responsible: string;
  executionDate: string;

  inProgress: boolean;

  priorityName: string;

  categoryData: {
    id: string;
    name: string;
  };

  reportData: {
    cost: string;
    observation: string;
  };

  users: string[];
}

interface ICreateOccasionalMaintenance {
  origin: string;
  userId: string;
  occasionalMaintenanceType: "pending" | "finished";
  occasionalMaintenanceData: IOccasionalMaintenanceData;
}

interface ICreateOccasionalMaintenanceResponse extends ApiMutationResponse {
  maintenance: {
    id: string;
  };
}

export const createOccasionalMaintenance = async ({
  origin,
  userId,
  occasionalMaintenanceType,
  occasionalMaintenanceData,
}: ICreateOccasionalMaintenance): Promise<MutationResponse<ICreateOccasionalMaintenanceResponse>> => {
  try {
    const {
      buildingId,
      executionDate,
      categoryData,
      reportData,
      inProgress,
      element,
      activity,
      responsible,
      priorityName,
      users,
    } = occasionalMaintenanceData;

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
        files: [],
        images: [],
      },

      usersId: users,
    };

    const response = await baseApi.post<ICreateOccasionalMaintenanceResponse>(
      "/company/buildings/reports/occasional/create",
      body,
    );

    alertMessage({
      type: "success",
      message: response.data.ServerMessage.message,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    alertCatchMessage({
      message: response.data.ServerMessage.message,
    });

    return {
      success: false,
      data: null,
    };
  }
};
