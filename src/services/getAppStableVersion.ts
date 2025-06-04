import AsyncStorage from "@react-native-async-storage/async-storage";

import type { IStableVersion } from "@/types/api/IStableVersion";

import { baseApi } from "./baseApi";

export const getAppStableVersion = async (): Promise<IStableVersion | null> => {
  const uri = `mobile/version`;

  try {
    const response = await baseApi.get<IStableVersion>(uri);

    await AsyncStorage.setItem(uri, JSON.stringify(response.data));

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar os dados ou sem internet, carregando do cache (getStableVersion):", error);

    try {
      const cachedData = await AsyncStorage.getItem(uri);

      if (cachedData) {
        console.log("Carregando dados do cache");
        return JSON.parse(cachedData) as IStableVersion;
      }
    } catch (cacheError) {
      console.error("Erro ao acessar o cache:", cacheError);
    }

    return null;
  }
};
