import { BuildingsBySyndicId } from "../../types"; // Certifique-se de ajustar o caminho para o seu tipo ApiResponse
import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para buscar os dados do Kanban
export const getBuildingsBySyndicNanoId = async (
  syndicNanoId: string
): Promise<BuildingsBySyndicId | null> => {
  // Chave para armazenamento no AsyncStorage
  const CACHE_KEY = `client/find-buildings-by-syndic-nano-id/${syndicNanoId}`;
  try {
    // Tenta fazer a requisição à API
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/find-buildings-by-syndic-nano-id/${syndicNanoId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: BuildingsBySyndicId = await response.json();

    // Salva os dados no AsyncStorage
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));

    return data; // Retorna os dados mais recentes
  } catch (error) {
    console.error(
      "Erro ao buscar os dados ou sem internet, carregando do cache:",
      error
    );

    // Tenta carregar os dados do AsyncStorage
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData) as BuildingsBySyndicId; // Retorna os dados armazenados
      }
    } catch (cacheError) {
      console.error("Erro ao carregar dados do cache:", cacheError);
    }

    return null; // Retorna null se nenhum dado for encontrado
  }
};
