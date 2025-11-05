import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { getUsers } from "@/services/queries/getUsers";

import { storageKeys } from "@/utils/storageKeys";

import type { AvailableFilter } from "@/types/utils/AvailableFilter";
import type { IListBuilding } from "@/types/utils/IListBuilding";
import type { KanbanFilter } from "@/types/utils/KanbanFilter";

import { Filters } from "../Filters";
import { styles } from "./styles";

interface FiltersButtonProps {
  filters: KanbanFilter;
  availableCategories: AvailableFilter[];
  setFilters: (filters: KanbanFilter) => void;
}

export const FiltersButton = ({ filters, setFilters, availableCategories }: FiltersButtonProps) => {
  const { openBottomSheet } = useBottomSheet();

  const [availableUsers, setAvailableUsers] = useState<AvailableFilter[]>([]);
  const [availableBuildings, setAvailableBuildings] = useState<AvailableFilter[]>([]);

  useEffect(() => {
    const getAvailableUsers = async () => {
      const responseData = await getUsers();

      if (responseData) {
        setAvailableUsers(
          responseData.users.map((user) => ({
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

        const availableBuildings: IListBuilding[] = JSON.parse(storageBuildings);
        setAvailableBuildings(
          availableBuildings.map(({ id, name }) => ({
            value: id,
            label: name,
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
