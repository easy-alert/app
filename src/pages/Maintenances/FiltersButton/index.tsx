import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { Filters } from "../Filters";
import { IFilter } from "../utils";
import { styles } from "./styles";

interface FiltersButtonProps {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
}

export const FiltersButton = ({ filters, setFilters }: FiltersButtonProps) => {
  const { openBottomSheet } = useBottomSheet();

  const openFilters = () =>
    openBottomSheet({
      content: <Filters filters={filters} setFilters={setFilters} />,
      fullSize: true,
    });

  return (
    <TouchableOpacity style={styles.button} onPress={openFilters}>
      <Text style={styles.label}>Filtros</Text>

      <Icon name="filter" size={24} style={styles.icon} />
    </TouchableOpacity>
  );
};
