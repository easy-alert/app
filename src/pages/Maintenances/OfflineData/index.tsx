import { View, Text } from "react-native";

import { useEffect, useState } from "react";

import NetInfo from "@react-native-community/netinfo";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "./styles";

import { processOfflineQueue, startPeriodicQueueProcessing } from "@/utils/processOfflineQueue";

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
      const offlineQueueString = await AsyncStorage.getItem("offline_queue");
      const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];
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
    <View>
      {offlineCount > 0 && (
        <View style={styles.container}>
          <Text style={styles.offlineCountLabel}>Fila Offline: {offlineCount} item(s)</Text>

          {isProcessing && <Text style={styles.indicatorLabel}>Processando dados da fila, aguarde...</Text>}
        </View>
      )}

      {!internetConnection && !isProcessing && (
        <View style={styles.container}>
          <Text style={styles.indicatorLabel}>Você está offline, alguns serviços podem estar indisponíveis...</Text>
        </View>
      )}
    </View>
  );
};
