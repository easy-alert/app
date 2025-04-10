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
    openBottomSheet({
      content: <Filters />,
      fullSize: true,
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={openFilters}>
      <Text style={styles.label}>Filtros</Text>

      <Icon name="filter" size={24} style={styles.icon} />
    </TouchableOpacity>
  );
};
