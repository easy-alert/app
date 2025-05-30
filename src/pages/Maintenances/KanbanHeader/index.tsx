import { View } from "react-native";

import type { AvailableFilter } from "@/types/utils/AvailableFilter";

import { FiltersButton } from "../FiltersButton";
import { IFilter } from "../utils";
import { styles } from "./styles";

interface KanbanHeaderProps {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
  availableCategories: AvailableFilter[];
}

export const KanbanHeader = ({ filters, setFilters, availableCategories }: KanbanHeaderProps) => {
  // TODO: mover o botão de filtros para o navbar

  return (
    <View style={styles.container}>
      <FiltersButton filters={filters} setFilters={setFilters} availableCategories={availableCategories} />
    </View>
  );
};
