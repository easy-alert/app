import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import NetInfo from "@react-native-community/netinfo";

import { styles } from "./styles";

import { processOfflineQueue, startPeriodicQueueProcessing, getOfflineQueue } from "@/utils/offlineQueue";

export const OfflineData = () => {
  const [offlineCount, setOfflineCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  useEffect(() => {
    const stopProcessing = startPeriodicQueueProcessing();

    return () => stopProcessing(); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    const getOfflineQueueCount = async () => {
      const offlineQueue = await getOfflineQueue();
      setOfflineCount(offlineQueue.length);
    };

    const processQueueOnReconnect = () => {
      NetInfo.addEventListener(async (state) => {
        if (state.isConnected) {
          setInternetConnection(true);
          setIsProcessing(true);
          await processOfflineQueue(); // Processa a fila
          setIsProcessing(false);
          await getOfflineQueueCount(); // Atualiza o contador
        } else {
          setInternetConnection(false);
        }
      });
    };

    getOfflineQueueCount(); // Atualiza o contador ao montar o componente
    processQueueOnReconnect(); // Observa reconexões de internet
  }, []);

  return (
    <View style={styles.container}>
      {offlineCount > 0 && (
        <>
          <Text style={[styles.itemContainer, styles.offlineCountLabel]}>Fila Offline: {offlineCount} item(s)</Text>

          {isProcessing && (
            <Text style={[styles.itemContainer, styles.indicatorLabel]}>Processando dados da fila, aguarde...</Text>
          )}
        </>
      )}

      {!internetConnection && (
        <Text style={[styles.itemContainer, styles.indicatorLabel]}>
          Você está offline, alguns serviços podem estar indisponíveis...
        </Text>
      )}
    </View>
  );
};
