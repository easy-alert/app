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

export const getCategoriesByBuildingNanoId = async ({
  buildingNanoId,
}: IGetCategoriesByBuildingNanoId) => {
  const uri = `https://easyalert-production.herokuapp.com/api/client/buildings/maintenances/occasional/auxiliarydata/${buildingNanoId}`;

  // Chave para armazenamento no AsyncStorage
  const CACHE_KEY = `client/buildings/maintenances/occasional/auxiliarydata/${buildingNanoId}`;
  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data: IResponseGetCategoriesByBuildingNanoId = await response.json();
    const { Categories: categories } = data.data;

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

    return [] as ICategory[]; // Retorna uma lista vazia se nenhum dado for encontrado
  }
};
