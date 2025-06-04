import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosRequestConfig } from "axios";

import { baseApi } from "./baseApi";

interface GetFromCacheOnErrorProps {
  url: string;
  cacheKey?: string;
  config?: AxiosRequestConfig;
}

export async function getFromCacheOnError<T>({ url, cacheKey, config }: GetFromCacheOnErrorProps): Promise<T | null> {
  try {
    const response = await baseApi.get<T>(url, config);

    await AsyncStorage.setItem(cacheKey || url, JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache.", error);

    try {
      const cachedData = await AsyncStorage.getItem(cacheKey || url);

      if (cachedData) {
        return JSON.parse(cachedData) as T;
      }
    } catch (cacheError) {
      console.error("Erro ao acessar o cache.", cacheError);
    }

    return null;
  }
}
