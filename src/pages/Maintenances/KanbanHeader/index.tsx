import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import type { Navigation } from "@/routes/navigation";
import type { IAvailableFilter } from "@/types/IAvailableFilter";

import { FiltersButton } from "../FiltersButton";
import { IFilter } from "../utils";
import { styles } from "./styles";

interface KanbanHeaderProps {
  buildingName: string;
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
  availableUsers: IAvailableFilter[];
  availableCategories: IAvailableFilter[];
}

export const KanbanHeader = ({
  buildingName,
  filters,
  setFilters,
  availableUsers,
  availableCategories,
}: KanbanHeaderProps) => {
  const navigation = useNavigation<Navigation>();

  const handleNavigateToBuildings = () => {
    navigation.navigate("Buildings");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateToBuildings} style={styles.buildingNameButton}>
        <Text style={styles.buildingNameLabel} numberOfLines={1}>
          {buildingName}
        </Text>

        <Icon name="repeat" size={24} style={styles.icon} />
      </TouchableOpacity>

      <FiltersButton
        filters={filters}
        setFilters={setFilters}
        availableUsers={availableUsers}
        availableCategories={availableCategories}
      />
    </View>
  );
};
