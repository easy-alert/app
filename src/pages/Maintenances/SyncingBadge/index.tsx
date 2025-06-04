import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { useOfflineQueue } from "@/contexts/OfflineQueueContext";

import { styles } from "./styles";

export const SyncingBadge = () => {
  const { offlineQueue, isSyncing } = useOfflineQueue();

  if (!isSyncing) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#fff" />

      <Text style={styles.label}>{"Sincronizando"}</Text>

      <View style={styles.countContainer}>
        <Text style={styles.countLabel}>{offlineQueue.length}</Text>
      </View>
    </View>
  );
};
