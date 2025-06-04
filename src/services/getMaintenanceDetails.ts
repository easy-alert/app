import AsyncStorage from "@react-native-async-storage/async-storage";

import { IMaintenance } from "@/types/api/IMaintenance";

import { baseApi } from "./baseApi";

interface IGetMaintenanceDetails {
  maintenanceHistoryId: string;
}

export const getMaintenanceDetails = async ({
  maintenanceHistoryId,
}: IGetMaintenanceDetails): Promise<IMaintenance | null> => {
  const url = `/company/maintenances/list/details/${maintenanceHistoryId}`;

  try {
    const response = await baseApi.get<IMaintenance>(url);

    await AsyncStorage.setItem(url, JSON.stringify(response.data));

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache (getMaintenanceDetails):", error);

    try {
      const cachedData = await AsyncStorage.getItem(url);

      if (cachedData) {
        return JSON.parse(cachedData) as IMaintenance;
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null; // Retorna null se nenhum dado for encontrado
  }
};
