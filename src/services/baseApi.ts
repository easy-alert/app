import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { storageKeys } from "@/utils/storageKeys";

export const baseApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.easyalert.com.br/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

baseApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(storageKeys.AUTH_TOKEN_KEY);

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

baseApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
