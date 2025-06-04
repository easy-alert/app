import { View } from "react-native";

import type { AvailableFilter } from "@/types/utils/AvailableFilter";
import { Filter } from "@/types/utils/Filter";

import { FiltersButton } from "../FiltersButton";
import { styles } from "./styles";

interface KanbanHeaderProps {
  filters: Filter;
  setFilters: (filters: Filter) => void;
  availableCategories: AvailableFilter[];
}

export const KanbanHeader = ({ filters, setFilters, availableCategories }: KanbanHeaderProps) => {
  return (
    <View style={styles.container}>
      <FiltersButton filters={filters} setFilters={setFilters} availableCategories={availableCategories} />
    </View>
  );
};
