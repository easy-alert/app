import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { getUsers } from "@/services/queries/getUsers";
import { IAuthUser } from "@/types/api/IAuthUser";
import { AvailableFilter } from "@/types/utils/AvailableFilter";
import { Filter } from "@/types/utils/Filter";

import { Filters } from "../Filters";
import { styles } from "./styles";

// TODO: refatorar
type IBuilding = IAuthUser["UserBuildingsPermissions"][0];

interface FiltersButtonProps {
  filters: Filter;
  setFilters: (filters: Filter) => void;
  availableCategories: AvailableFilter[];
}

export const FiltersButton = ({ filters, setFilters, availableCategories }: FiltersButtonProps) => {
  const { openBottomSheet } = useBottomSheet();

  const [availableUsers, setAvailableUsers] = useState<AvailableFilter[]>([]);
  const [availableBuildings, setAvailableBuildings] = useState<AvailableFilter[]>([]);

  useEffect(() => {
    const getAvailableUsers = async () => {
      // TODO: retirar try catch quando adicionar os tipos
      try {
        const responseData = await getUsers();

        if (responseData?.users) {
          setAvailableUsers(
            responseData.users.map((user: { id: string; name: string }) => ({
              value: user.id,
              label: user.name,
            })),
          );
        }
      } catch (error) {
        console.error("🚀 ~ getAvailableUsers ~ error:", error);
      }
    };

    const getAvailableBuildings = async () => {
      try {
        const storageBuildings = await AsyncStorage.getItem("buildingsList");

        if (!storageBuildings) {
          throw new Error("Nenhum prédio encontrado.");
        }

        const availableBuildings = JSON.parse(storageBuildings) as IBuilding[];

        setAvailableBuildings(
          availableBuildings.map((building) => ({
            value: building.Building.id,
            label: building.Building.name,
          })),
        );
      } catch (error) {
        console.error("Erro ao carregar a lista de prédios:", error);
      }
    };

    getAvailableUsers();
    getAvailableBuildings();
  }, []);

  const openFilters = () =>
    openBottomSheet({
      content: (
        <Filters
          filters={filters}
          setFilters={setFilters}
          availableBuildings={availableBuildings}
          availableUsers={availableUsers}
          availableCategories={availableCategories}
        />
      ),
      fullSize: true,
    });

  return (
    <TouchableOpacity style={styles.button} onPress={openFilters}>
      <Text style={styles.label}>Filtros</Text>

      <Icon name="filter" size={24} style={styles.icon} />
    </TouchableOpacity>
  );
};
