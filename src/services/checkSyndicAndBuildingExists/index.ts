import { baseApi } from "../baseApi";

import { Alert } from "react-native";

import type { IUser } from '../../types/IUser';

interface ICheckSyndicAndBuildingExists {
  login: string;
  password?: string;
  createPassword?: boolean;
}

// Função para buscar os dados do Kanban
export const checkSyndicAndBuildingExists = async ({
  login,
  password,
}: ICheckSyndicAndBuildingExists): Promise<{
  user: IUser;
}> => {
  const url = `/mobile/auth`;

  const body = {
    login,
    password,
  };

  try {
    const response = await baseApi.post(url, body);

    if (response.data.error) {
      Alert.alert("Erro", response.data.error);
      return { user: {} as IUser };
    }

    return response.data
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return {user: {} as IUser};
  }
};
