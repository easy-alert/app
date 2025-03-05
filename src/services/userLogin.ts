import { baseApi } from "./baseApi";

import { Alert } from "react-native";

import type { IUser } from '../types/IUser';

interface IUserLogin {
  login: string;
  password?: string;
}


export const userLogin = async ({
  login,
  password,
}: IUserLogin): Promise<{
  user: IUser;
  authToken: string;
}> => {
  const url = `/mobile/auth/login`;

  const body = {
    login,
    password,
  };

  try {
    const response = await baseApi.post(url, body);

    if (response.data.error) {
      Alert.alert("Erro", response.data.error);
      return { user: {} as IUser, authToken: "" };
    }

    return response.data
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return { user: {} as IUser, authToken: "" };
  }
};
