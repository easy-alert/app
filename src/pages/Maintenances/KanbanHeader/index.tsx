import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import type { Navigation } from "@/routes/navigation";

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

  return (
    <View style={styles.container}>
      <View style={styles.buildingNameContainer}>
        <Text style={styles.buildingNameLabel}>{buildingName}</Text>

        <TouchableOpacity onPress={handleNavigateToBuildings} style={styles.buildingNameButton}>
          <Icon name="repeat" size={24} color="#b21d1d" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
