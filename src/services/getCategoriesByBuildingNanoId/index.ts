// GLOBAL TYPES
import type { ICategory, IResponse } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IGetCategoriesByBuildingNanoId {
  buildingNanoId: string;
}

export const getCategoriesByBuildingNanoId = async ({
  buildingNanoId,
}: IGetCategoriesByBuildingNanoId) => {
  const uri = `https://easyalert-production.herokuapp.com/api/client/buildings/maintenances/occasional/auxiliarydata/${buildingNanoId}`;

  // Chave para armazenamento no AsyncStorage
  const CACHE_KEY = `client/buildings/maintenances/occasional/auxiliarydata/${buildingNanoId}`;

  try {
    console.log("Iniciando requisição para:", uri);

    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status da resposta:", response.status, response.statusText);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      const rawResponse = await response.text(); // Captura o conteúdo bruto
      console.error("Erro na resposta da API:", rawResponse);
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json(); // Faz o parse do JSON

    // Verifica se Categories existe e é uma lista
    if (!Array.isArray(data?.Categories)) {
      console.error("Formato inesperado da resposta:");
      throw new Error("Categorias ausentes ou no formato errado na resposta");
    }

    const categories = data.Categories;

    // Salva no cache
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(categories));
    console.log("Categorias armazenadas no cache:");

    return categories;
  } catch (error: any) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache:",
      error
    );

    // Tenta carregar os dados do cache
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        console.log("Carregando dados do cache");
        return JSON.parse(cachedData) as ICategory[];
      }
    } catch (cacheError) {
      console.error("Erro ao acessar o cache:", cacheError);
    }

    // Retorna uma lista vazia em caso de erro
    return [] as ICategory[];
  }
};
