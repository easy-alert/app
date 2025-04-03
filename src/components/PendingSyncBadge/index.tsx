import { View, Text } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import { styles } from "./styles";

export const PendingSyncBadge = () => {
  return (
    <View style={styles.pendingSyncContainer}>
      <Icon name="cloud-offline-outline" size={16} color="#fff" />
      <Text style={styles.pendingSyncLabel}>Sincronização pendente</Text>
    </View>
  );
};
