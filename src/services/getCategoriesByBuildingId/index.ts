// GLOBAL TYPES
import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from '../baseApi';

import type { ICategory, } from "../../types";

interface IGetCategoriesByBuildingNanoId {
  buildingNanoId: string;
}

export const getCategoriesByBuildingId = async () => {
  const uri = `company/buildings/maintenances/occasional/auxiliarydata/`;

  try {
    const response = await baseApi.get(uri);

    // Verifica se Categories existe e é uma lista
    if (!Array.isArray(response.data?.Categories)) {
      console.error("Formato inesperado da resposta:");
      throw new Error("Categorias ausentes ou no formato errado na resposta");
    }

    const categories = response?.data?.Categories;

    // Salva no cache
    await AsyncStorage.setItem(uri, JSON.stringify(categories));
    console.log("Categorias armazenadas no cache:");

    return categories;
  } catch (error: any) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache:",
      error
    );

    // Tenta carregar os dados do cache
    try {
      const cachedData = await AsyncStorage.getItem(uri);

      if (cachedData) {
        console.log("Carregando dados do cache");
        return JSON.parse(cachedData) as ICategory[];
      }
    } catch (cacheError) {
      console.error("Erro ao acessar o cache:", cacheError);
    }

    return [] as ICategory[];
  }
};
