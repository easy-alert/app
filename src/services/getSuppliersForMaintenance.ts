import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from "./baseApi";

interface IGetSuppliersForMaintenance {
  maintenanceId: string;
}

export async function getSuppliersForMaintenance({
  maintenanceId,
}: IGetSuppliersForMaintenance) {
  const uri = `company/suppliers/to-select/${maintenanceId}`;

  try {
    const response = await baseApi.get(uri);

    await AsyncStorage.setItem(uri, JSON.stringify(response.data));

    return response.data; // Retorna os dados mais recentes
  } catch (error) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache:",
      error
    );

    try {
      const cachedData = await AsyncStorage.getItem(uri);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null
  }
}
