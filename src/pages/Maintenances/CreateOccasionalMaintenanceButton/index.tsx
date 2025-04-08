import { TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import type { Navigation } from "@/routes/navigation";

interface CreateOccasionalMaintenanceButtonProps {
  buildingId: string;
}

export const CreateOccasionalMaintenanceButton = ({ buildingId }: CreateOccasionalMaintenanceButtonProps) => {
  const navigation = useNavigation<Navigation>();

  const handleNavigateToCreateOccasionalMaintenance = () => {
    navigation.navigate("CreateOccasionalMaintenance", {
      buildingId,
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleNavigateToCreateOccasionalMaintenance}>
      <Icon name="plus" size={30} color="#fff" />
    </TouchableOpacity>
  );
};
