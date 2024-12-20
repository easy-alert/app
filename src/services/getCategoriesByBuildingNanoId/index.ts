// SERVICES
import { baseApi } from "../baseApi";

// GLOBAL TYPES
import type { ICategory, IResponse } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IGetCategoriesByBuildingNanoId {
  buildingNanoId: string;
}

interface IResponseGetCategoriesByBuildingNanoId extends IResponse {
  data: {
    Categories: ICategory[];
  };
}

// Chave para armazenamento no AsyncStorage
const CACHE_KEY = "client/buildings/maintenances/occasional/auxiliarydata/";

export const getCategoriesByBuildingNanoId = async ({
  buildingNanoId,
}: IGetCategoriesByBuildingNanoId) => {
  const uri = `/client/buildings/maintenances/occasional/auxiliarydata/${buildingNanoId}`;

  try {
    const response: IResponseGetCategoriesByBuildingNanoId = await baseApi.get(
      uri
    );

    const { Categories: categories } = response.data;

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(categories));

    return categories;
  } catch (error: any) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache:",
      error
    );

    const cachedData = await AsyncStorage.getItem(CACHE_KEY);

    if (cachedData) {
      return JSON.parse(cachedData) as ICategory[]; // Retorna os dados armazenados
    }

    return [] as ICategory[]; // Retorna null se nenhum dado for encontrado
  }
};
