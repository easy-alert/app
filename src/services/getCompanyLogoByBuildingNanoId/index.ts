// Função para buscar os dados do Kanban
export const getCompanyLogoByBuildingNanoId = async (
  buildingNanoId: string
): Promise<string | null> => {
  try {
    // Faz a requisição à API usando o syndicId fornecido
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/building/logo/${buildingNanoId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: string = await response.json();

    return data; // Retorna os dados mais recentes
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    return null; // Retorna null em caso de erro
  }
};
