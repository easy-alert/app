import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { Filters } from "../Filters";
import { createStyle } from "./styles";

export const FiltersButton = () => {
  const { openBottomSheet } = useBottomSheet();

  const filtersCount = 0; // TODO: get filters count

  const styles = createStyle(filtersCount);

  const openFilters = () => {
    openBottomSheet(<Filters />);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={openFilters}>
      <Icon name="filter" size={22} color={filtersCount > 0 ? "#B22222" : "black"} />

      <Text style={styles.label}>Filtros</Text>

      {filtersCount > 0 && <Text style={styles.countLabel}>{filtersCount}</Text>}
    </TouchableOpacity>
  );
};
