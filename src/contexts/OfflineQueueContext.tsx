import NetInfo from "@react-native-community/netinfo";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { getOfflineQueue, syncOfflineQueue } from "@/utils/offlineQueue";

interface OfflineQueueContextData {
  offlineQueueLength: number;
  hasInternetConnection: boolean;
  isSyncing: boolean;
}

const OfflineQueueContext = createContext({} as OfflineQueueContextData);

export const OfflineQueueProvider = ({ children }: { children: ReactNode }) => {
  const [offlineQueueLength, setOfflineQueueLength] = useState(0);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);
  const isSyncing = hasInternetConnection && offlineQueueLength > 0;

  useEffect(() => {
    const getOfflineQueueCount = async () => {
      const offlineQueue = await getOfflineQueue();
      setOfflineQueueLength(offlineQueue.length);
    };

    const syncQueueOnReconnect = () =>
      NetInfo.addEventListener(async (state) => {
        try {
          if (!state.isConnected) {
            setHasInternetConnection(false);
            return;
          }

          setHasInternetConnection(true);
          await syncOfflineQueue();
          await getOfflineQueueCount();
        } catch {}
      });

    const syncQueueOnInterval = () =>
      setInterval(async () => {
        try {
          const networkState = await NetInfo.fetch();

          if (networkState.isConnected) {
            await syncOfflineQueue();
          }

          await getOfflineQueueCount();
        } catch {}
      }, 3000);

    getOfflineQueueCount();

    const unsubscribe = syncQueueOnReconnect();
    const interval = syncQueueOnInterval();

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <OfflineQueueContext.Provider
      value={{
        offlineQueueLength,
        hasInternetConnection,
        isSyncing,
      }}
    >
      {children}
    </OfflineQueueContext.Provider>
  );
};

export const useOfflineQueue = (): OfflineQueueContextData => useContext(OfflineQueueContext);
