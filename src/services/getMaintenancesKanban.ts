import { baseApi } from "./baseApi";

interface IGetMaintenancesKanban {
  userId: string;
  filter: {
    buildings: string[];
    status: string[];
    categories: string[];
    users: string[];
    priorityName: string;
    startDate?: string;
    endDate?: string;
  };
}

export const getMaintenancesKanban = async ({ userId, filter }: IGetMaintenancesKanban) => {
  const params = {
    buildingId: filter?.buildings?.length === 0 ? "" : filter?.buildings?.join(","),
    status: filter?.status?.length === 0 ? "" : filter?.status?.join(","),
    category: filter?.categories?.length === 0 ? "" : filter?.categories?.join(","),
    user: filter?.users?.length === 0 ? "" : filter?.users?.join(","),
    priorityName: filter?.priorityName ?? "",
    startDate: filter?.startDate,
    endDate: filter?.endDate,
    userId,
  };

  const uri = "/mobile/buildings/maintenances/kanban";

  try {
    const response = await baseApi.get(uri, { params });

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return {};
  }
};
