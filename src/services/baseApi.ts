import axios from "axios";

export const baseApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
