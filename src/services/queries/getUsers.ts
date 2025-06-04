import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from "../baseApi";

// TODO: add return types
export const getUsers = async (buildingId?: string) => {
  const params = {
    buildingId: buildingId || "",
    checkPerms: false,
  };

  const url = "/company/list/users";

  // Criar uma chave única para o cache com base na URI + parâmetros
  const cacheKey = `${url}?${new URLSearchParams(params as any).toString()}`;

  try {
    const response = await baseApi.get(url, { params });

    await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache (getUsers):", error);

    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return {}; // Retorna objeto vazio se nada for encontrado
  }
};
