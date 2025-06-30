import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { getUsers } from "@/services/queries/getUsers";
import { IBuilding } from "@/types/api/IBuilding";
import { AvailableFilter } from "@/types/utils/AvailableFilter";
import { Filter } from "@/types/utils/Filter";
import { storageKeys } from "@/utils/storageKeys";

import { Filters } from "../Filters";
import { styles } from "./styles";

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
      const users = await getUsers();

      if (users) {
        setAvailableUsers(
          users.users.map((user) => ({
            value: user.id,
            label: user.name,
          })),
        );
      }
    };

    const getAvailableBuildings = async () => {
      try {
        const storageBuildings = await AsyncStorage.getItem(storageKeys.BUILDING_LIST_KEY);

        if (!storageBuildings) {
          throw new Error("Nenhum prédio encontrado.");
        }

        const availableBuildings: IBuilding[] = JSON.parse(storageBuildings);

        setAvailableBuildings(
          availableBuildings.map((building) => ({
            value: building.id,
            label: building.name,
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
