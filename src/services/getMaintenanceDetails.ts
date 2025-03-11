import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from "./baseApi";

export interface IGetMaintenanceDetails {
  maintenanceHistoryId: string;
}

export const getMaintenanceDetails = async ({ maintenanceHistoryId }: IGetMaintenanceDetails) => {
  const uri = `company/maintenances/list/details/${maintenanceHistoryId}`;

  try {
    const response = await baseApi.get(uri);

    await AsyncStorage.setItem(uri, JSON.stringify(response.data));

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache:", error);

    try {
      const cachedData = await AsyncStorage.getItem(uri);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null; // Retorna null se nenhum dado for encontrado
  }
};
