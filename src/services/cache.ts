import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseApi } from "./baseApi";

export async function getFromCacheOnError<T>({ url }: { url: string }): Promise<T | null> {
  try {
    const response = await baseApi.get<T>(url);

    await AsyncStorage.setItem(url, JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache.", error);

    try {
      const cachedData = await AsyncStorage.getItem(url);

      if (cachedData) {
        return JSON.parse(cachedData) as T;
      }
    } catch (cacheError) {
      console.error("Erro ao acessar o cache.", cacheError);
    }

    return null;
  }
}
