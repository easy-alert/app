import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { useOfflineQueue } from "@/contexts/OfflineQueueContext";

import { createStyle } from "./styles";

export const OfflineQueueBadge = () => {
  const { hasInternetConnection, offlineQueueLength, isSyncing } = useOfflineQueue();

  if (hasInternetConnection && offlineQueueLength === 0) {
    return null;
  }

  const styles = createStyle(isSyncing);

  return (
    <View style={styles.container}>
      {isSyncing && <ActivityIndicator color="#fff" />}
      {!isSyncing && <Icon name={"cloud-offline-outline"} size={16} color="#fff" />}

      <Text style={styles.label}>{isSyncing ? "Sincronizando" : "Offline"}</Text>

      {offlineQueueLength > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countLabel}>{offlineQueueLength}</Text>
        </View>
      )}
    </View>
  );
};
