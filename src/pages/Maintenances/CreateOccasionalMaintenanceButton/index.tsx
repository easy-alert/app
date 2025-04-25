import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import type { ProtectedNavigation } from "@/routes/navigation";

import { styles } from "./styles";

export const CreateOccasionalMaintenanceButton = () => {
  const navigation = useNavigation<ProtectedNavigation>();

  const handleNavigateToCreateOccasionalMaintenance = () => {
    navigation.navigate("CreateOccasionalMaintenance");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleNavigateToCreateOccasionalMaintenance}>
      <Icon name="plus" size={30} color="#fff" />
    </TouchableOpacity>
  );
};
