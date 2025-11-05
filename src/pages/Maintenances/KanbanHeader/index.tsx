import { View } from "react-native";

import type { AvailableFilter } from "@/types/utils/AvailableFilter";
import type { KanbanFilter } from "@/types/utils/KanbanFilter";

import { FiltersButton } from "../FiltersButton";
import { styles } from "./styles";

interface KanbanHeaderProps {
  filters: KanbanFilter;
  setFilters: (filters: KanbanFilter) => void;
  availableCategories: AvailableFilter[];
}

export const KanbanHeader = ({ filters, setFilters, availableCategories }: KanbanHeaderProps) => {
  return (
    <View style={styles.container}>
      <FiltersButton filters={filters} setFilters={setFilters} availableCategories={availableCategories} />
    </View>
  );
};
