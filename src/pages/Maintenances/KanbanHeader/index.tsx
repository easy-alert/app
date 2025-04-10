import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useBottomSheet } from "@/contexts/BottomSheetContext";
import type { Navigation } from "@/routes/navigation";

import { Filters, FiltersFooter } from "../Filters";
import { styles } from "./styles";

interface KanbanHeaderProps {
  buildingName: string;
  buildingId: string;
}

export const KanbanHeader = ({ buildingName, buildingId }: KanbanHeaderProps) => {
  const navigation = useNavigation<Navigation>();

  const handleNavigateToBuildings = () => {
    navigation.navigate("Buildings");
  };

  const { openBottomSheet } = useBottomSheet();

  const openFilters = () => {
    openBottomSheet({
      content: <Filters />,
      footer: <FiltersFooter />,
      fullSize: true,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateToBuildings} style={styles.buildingNameButton}>
        <Text style={styles.buildingNameLabel}>{buildingName}</Text>

        <Icon name="repeat" size={24} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.filterButton} onPress={openFilters}>
        <Text style={styles.filterButtonLabel}>Filtros</Text>

        <Icon name="filter" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};
