import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { getUsers } from "@/services/getUsers";
import { IAvailableFilter } from "@/types/IAvailableFilter";
import { IUser } from "@/types/IUser";

import { Filters } from "../Filters";
import { IFilter } from "../utils";
import { styles } from "./styles";

type IBuilding = IUser["UserBuildingsPermissions"][0];

interface FiltersButtonProps {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
  availableCategories: IAvailableFilter[];
}

export const FiltersButton = ({ filters, setFilters, availableCategories }: FiltersButtonProps) => {
  const { openBottomSheet } = useBottomSheet();

  const [availableUsers, setAvailableUsers] = useState<IAvailableFilter[]>([]);
  const [availableBuildings, setAvailableBuildings] = useState<IAvailableFilter[]>([]);

  useEffect(() => {
    const getAvailableUsers = async () => {
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
