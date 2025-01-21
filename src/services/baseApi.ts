import axios from "axios";

export const baseApi = axios.create({
  baseURL: "https://easyalert-production.herokuapp.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
