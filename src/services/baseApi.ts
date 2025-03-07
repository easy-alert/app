import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const baseApi = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ??
    "https://easyalert-production.herokuapp.com/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

baseApi.interceptors.request.use(
  async (config: any) => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

baseApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
