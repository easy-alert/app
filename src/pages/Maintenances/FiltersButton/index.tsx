import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { IAvailableFilter } from "@/types/IAvailableFilter";

import { Filters } from "../Filters";
import { IFilter } from "../utils";
import { styles } from "./styles";

interface FiltersButtonProps {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
  availableUsers: IAvailableFilter[];
  availableCategories: IAvailableFilter[];
}

export const FiltersButton = ({ filters, setFilters, availableUsers, availableCategories }: FiltersButtonProps) => {
  const { openBottomSheet } = useBottomSheet();

  const openFilters = () =>
    openBottomSheet({
      content: (
        <Filters
          filters={filters}
          setFilters={setFilters}
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
