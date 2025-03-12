import { Alert } from "react-native";

import { baseApi } from "./baseApi";

interface IGetBuildingLogo {
  buildingId: string;
}

export const getBuildingLogo = async ({
  buildingId,
}: IGetBuildingLogo): Promise<{
  buildingLogo: string;
}> => {
  const url = `/mobile/buildings/${buildingId}/logo`;

  try {
    const response = await baseApi.get(url);

    if (response.data.error) {
      Alert.alert("Erro", response.data.error);
      return { buildingLogo: "" };
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return { buildingLogo: "" };
  }
};
