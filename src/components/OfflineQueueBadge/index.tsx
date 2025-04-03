import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/Ionicons";

import { createStyle } from "./styles";

import { syncOfflineQueue, startPeriodicQueueSync, getOfflineQueue } from "@/utils/offlineQueue";

export const OfflineQueueBadge = () => {
  const [offlineQueueLength, setOfflineQueueLength] = useState(0);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);

  useEffect(() => {
    const stopSyncCaller = startPeriodicQueueSync();
    return () => stopSyncCaller(); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    const getOfflineQueueCount = async () => {
      const offlineQueue = await getOfflineQueue();
      setOfflineQueueLength(offlineQueue.length);
    };

    const syncQueueOnReconnect = () => {
      NetInfo.addEventListener(async (state) => {
        if (!state.isConnected) {
          setHasInternetConnection(false);
          return;
        }

        setHasInternetConnection(true);
        await syncOfflineQueue();
        await getOfflineQueueCount();
      });
    };

    getOfflineQueueCount(); // Atualiza o contador ao montar o componente
    syncQueueOnReconnect(); // Observa reconexões de internet
  }, []);

  if (hasInternetConnection && offlineQueueLength === 0) {
    return null;
  }

  const isSyncing = hasInternetConnection && offlineQueueLength > 0;

  const styles = createStyle(isSyncing);

  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        {isSyncing && <ActivityIndicator color="#fff" />}
        {!isSyncing && <Icon name={"cloud-offline-outline"} size={16} color="#fff" />}

        <Text style={styles.offlineLabel}>{isSyncing ? "Sincronizando" : "Offline"}</Text>

        {offlineQueueLength > 0 && <Text style={styles.offlineQueueLengthLabel}>{offlineQueueLength}</Text>}
      </View>
    </View>
  );
};
