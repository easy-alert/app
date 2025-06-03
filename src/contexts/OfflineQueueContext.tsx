import NetInfo from "@react-native-community/netinfo";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { OfflineQueueItem } from "@/types/utils/OfflineQueueItem";
import { getOfflineQueue, syncOfflineQueue } from "@/utils/offlineQueue";

interface OfflineQueueContextData {
  offlineQueue: OfflineQueueItem[];
  hasInternetConnection: boolean;
  isSyncing: boolean;
}

const OfflineQueueContext = createContext({} as OfflineQueueContextData);

export const OfflineQueueProvider = ({ children }: { children: ReactNode }) => {
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);
  const isSyncing = hasInternetConnection && offlineQueue.length > 0;

  useEffect(() => {
    const getOfflineQueueCount = async () => {
      const offlineQueue = await getOfflineQueue();
      setOfflineQueue(offlineQueue);
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
        offlineQueue,
        hasInternetConnection,
        isSyncing,
      }}
    >
      {children}
    </OfflineQueueContext.Provider>
  );
};

export const useOfflineQueue = (): OfflineQueueContextData => useContext(OfflineQueueContext);
