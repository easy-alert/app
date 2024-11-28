import { PasswordNeeded } from "../../types";

// Função para buscar os dados do Kanban
export const checkPasswordNeeded = async (
  buildingNanoId: string
): Promise<PasswordNeeded | null> => {
  try {
    // Tenta fazer a requisição à API
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/check-password-existence/${buildingNanoId}/responsible`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: PasswordNeeded = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados ou sem internet:", error);

    return null;
  }
};
