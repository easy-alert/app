import AsyncStorage from "@react-native-async-storage/async-storage";

import { IMaintenanceHistoryActivities } from "@/types/api/IMaintenanceHistoryActivities";

import { baseApi } from "./baseApi";

interface IGetMaintenanceHistoryActivities {
  maintenanceHistoryId: string;
}

export const getMaintenanceHistoryActivities = async ({
  maintenanceHistoryId,
}: IGetMaintenanceHistoryActivities): Promise<IMaintenanceHistoryActivities | null> => {
  const url = `/company/maintenance-history-activities/${maintenanceHistoryId}`;

  try {
    const response = await baseApi.get<IMaintenanceHistoryActivities>(url);

    await AsyncStorage.setItem(url, JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache(getMaintenanceHistoryActivities):",
      error,
    );

    try {
      const cachedData = await AsyncStorage.getItem(url);

      if (cachedData) {
        return JSON.parse(cachedData) as IMaintenanceHistoryActivities;
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null; // Retorna null se nenhum dado for encontrado
  }
};
