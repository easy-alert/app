import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ICategory } from "@/types/api/ICategory";

import { baseApi } from "../baseApi";

export const getCategories = async (): Promise<ICategory[]> => {
  const url = "/company/buildings/maintenances/occasional/auxiliarydata";

  try {
    const response = await baseApi.get(url);

    // Verifica se Categories existe e é uma lista
    if (!Array.isArray(response.data?.Categories)) {
      console.error("Formato inesperado da resposta:");
      throw new Error("Categorias ausentes ou no formato errado na resposta");
    }

    const categories: ICategory[] = response.data.Categories;

    // Salva no cache
    await AsyncStorage.setItem(url, JSON.stringify(categories));
    console.log("Categorias armazenadas no cache:");

    return categories;
  } catch (error: any) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache (getCategories):", error);

    // Tenta carregar os dados do cache
    try {
      const cachedData = await AsyncStorage.getItem(url);

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
