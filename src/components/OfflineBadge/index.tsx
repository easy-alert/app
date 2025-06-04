import { Text, View } from "react-native";

import { useOfflineQueue } from "@/contexts/OfflineQueueContext";

import { styles } from "./styles";

export const OfflineBadge = () => {
  const { hasInternetConnection } = useOfflineQueue();

  if (hasInternetConnection) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sem conexão</Text>
    </View>
  );
};
