import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { styles } from "./styles";

export const PendingSyncBadge = () => {
  return (
    <View style={styles.container}>
      <Icon name="cloud-offline-outline" size={14} color="#fff" />
      <Text style={styles.label}>Sincronização pendente</Text>
    </View>
  );
};
