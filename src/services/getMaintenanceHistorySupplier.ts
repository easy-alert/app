import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from "./baseApi";

interface IGetMaintenanceHistorySupplier {
  maintenanceHistoryId: string;
}

export async function getMaintenanceHistorySupplier({ maintenanceHistoryId }: IGetMaintenanceHistorySupplier) {
  const uri = `company/suppliers/selected/${maintenanceHistoryId}`;

  try {
    const response = await baseApi.get(uri);

    await AsyncStorage.setItem(uri, JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache (getMaintenanceHistorySupplier):",
      error,
    );

    try {
      const cachedData = await AsyncStorage.getItem(uri);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null;
  }
}
