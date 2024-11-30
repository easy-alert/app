import { syndicBuildings } from "../../types";
const sampleData: syndicBuildings[] = [
  {
    buildingNanoId: "H7q61JMw0-yR",
    buildingName: "Serramares",
    syndicNanoId: "Fr8aLc-krzQn",
  },
];
// Função para buscar os dados do Kanban
export const checkSyndicAndBuildingExists = async (
  phoneNumber: string
): Promise<syndicBuildings[]> => {
  try {
    // Tenta fazer a requisição à API
    // const response = await fetch(
    //   `https://easyalert-production.herokuapp.com/api/mobile/auth?phoneNumber${phoneNumber}`
    // );

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    // const data: syndicBuildings[] = await response.json();
    console.log(phoneNumber);

    if (phoneNumber === "48996244427") {
      const data: syndicBuildings[] = sampleData;
      return data;
    } else {
      throw new Error(`Não autenticado`);
    }
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return [];
  }
};
