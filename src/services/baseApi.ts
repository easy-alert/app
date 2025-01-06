import axios from "axios";

export const baseApi = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ||
    "https://easyalert-production.herokuapp.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
