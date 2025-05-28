import AsyncStorage from "@react-native-async-storage/async-storage";

import { IMaintenanceSuppliers } from "@/types/IMaintenanceSuppliers";

import { baseApi } from "./baseApi";

interface IGetSuppliersForMaintenance {
  maintenanceId: string;
}

export const getSuppliersForMaintenance = async ({
  maintenanceId,
}: IGetSuppliersForMaintenance): Promise<IMaintenanceSuppliers | null> => {
  const uri = `company/suppliers/to-select/${maintenanceId}`;

  try {
    const response = await baseApi.get<IMaintenanceSuppliers>(uri);

    await AsyncStorage.setItem(uri, JSON.stringify(response.data));

    return response.data; // Retorna os dados mais recentes
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache (getSuppliersForMaintenance):", error);

    try {
      const cachedData = await AsyncStorage.getItem(uri);

      if (cachedData) {
        return JSON.parse(cachedData) as IMaintenanceSuppliers;
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null;
  }
};
