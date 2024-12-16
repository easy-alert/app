import { baseApi } from "../baseApi";

import type { syndicBuildings } from "../../types";
import { Alert } from "react-native";

interface ICheckSyndicAndBuildingExists {
  email?: string;
  phoneNumber?: string;
  password?: string;
  createPassword?: boolean;
}

// Função para buscar os dados do Kanban
export const checkSyndicAndBuildingExists = async ({
  email,
  phoneNumber,
  password,
  createPassword,
}: ICheckSyndicAndBuildingExists): Promise<{
  canLogin: boolean;
  hasPassword: boolean;
  buildings: syndicBuildings[];
}> => {
  const url = `/mobile/auth`;

  const body = {
    email,
    phoneNumber,
    password,
    createPassword,
  };

  try {
    const response = await baseApi.post(url, body);

    if (response.data.error) {
      Alert.alert("Erro", response.data.error);
      return { canLogin: false, hasPassword: false, buildings: [] };
    }

    const { canLogin, hasPassword, buildings } = response.data;

    return { canLogin, hasPassword, buildings };
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return { canLogin: false, hasPassword: false, buildings: [] };
  }
};
