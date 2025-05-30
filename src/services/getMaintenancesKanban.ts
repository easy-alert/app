import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from "./baseApi";

interface IGetMaintenancesKanban {
  userId: string;
  filters: {
    buildings?: string[];
    status?: string[];
    categories?: string[];
    users?: string[];
    priorityName?: string;
    search?: string;
    startDate: string;
    endDate: string;
  };
}

export const getMaintenancesKanban = async ({ userId, filters }: IGetMaintenancesKanban) => {
  const params = {
    userId,
    buildingId: filters.buildings?.join(",") || "",
    status: filters.status?.join(",") || "",
    category: filters.categories?.join(",") || "",
    user: filters.users?.join(",") || "",
    priorityName: filters.priorityName || "",
    search: filters.search || "",
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  // TODO: remover a barra
  const uri = "/company/maintenances/kanban";

  // Criar uma chave única para o cache com base na URI + parâmetros
  const cacheKey = `${uri}?${new URLSearchParams(params as any).toString()}`;

  try {
    const response = await baseApi.get(uri, { params });

    await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache (getMaintenancesKanban):", error);

    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return {}; // Retorna objeto vazio se nada for encontrado
  }
};
