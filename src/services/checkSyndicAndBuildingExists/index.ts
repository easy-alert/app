import { syndicBuildings } from "../../types";

// Função para buscar os dados do Kanban
export const checkSyndicAndBuildingExists = async (
  phoneNumber: string
): Promise<syndicBuildings[]> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/mobile/auth?phoneNumber=${phoneNumber}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: syndicBuildings[] = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return [];
  }
};
