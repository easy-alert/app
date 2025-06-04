import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from "../baseApi";

interface IGetMaintenanceHistorySupplier {
  maintenanceHistoryId: string;
}

// TODO: add return types
export const getMaintenanceHistorySupplier = async ({ maintenanceHistoryId }: IGetMaintenanceHistorySupplier) => {
  const url = `/company/suppliers/selected/${maintenanceHistoryId}`;

  try {
    const response = await baseApi.get(url);

    await AsyncStorage.setItem(url, JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache (getMaintenanceHistorySupplier):",
      error,
    );

    try {
      const cachedData = await AsyncStorage.getItem(url);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null;
  }
};
