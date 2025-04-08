import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/Ionicons";

import { syncOfflineQueue, getOfflineQueue } from "@/utils/offlineQueue";

import { createStyle } from "./styles";

export const OfflineQueueBadge = () => {
  const [offlineQueueLength, setOfflineQueueLength] = useState(0);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);

  useEffect(() => {
    const getOfflineQueueCount = async () => {
      const offlineQueue = await getOfflineQueue();
      setOfflineQueueLength(offlineQueue.length);
    };

    const syncQueueOnReconnect = () =>
      NetInfo.addEventListener(async (state) => {
        if (!state.isConnected) {
          setHasInternetConnection(false);
          return;
        }

        setHasInternetConnection(true);
        await syncOfflineQueue();
        await getOfflineQueueCount();
      });

    const syncQueueOnInterval = () =>
      setInterval(async () => {
        const networkState = await NetInfo.fetch();

        if (networkState.isConnected) {
          await syncOfflineQueue();
          await getOfflineQueueCount();
        }
      }, 3000);

    getOfflineQueueCount();

    const unsubscribe = syncQueueOnReconnect();
    const interval = syncQueueOnInterval();

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
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
