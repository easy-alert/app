import NetInfo from "@react-native-community/netinfo";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { OfflineQueueItem } from "@/types/utils/OfflineQueueItem";
import { addItemToOfflineQueue, getOfflineQueue, syncOfflineQueue } from "@/utils/offlineQueue";

interface OfflineQueueContextData {
  offlineQueue: OfflineQueueItem[];
  hasInternetConnection: boolean;
  isSyncing: boolean;
  addItem: (item: OfflineQueueItem) => Promise<void>;
}

const OfflineQueueContext = createContext({} as OfflineQueueContextData);

export const OfflineQueueProvider = ({ children }: { children: ReactNode }) => {
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);
  const isSyncing = hasInternetConnection && offlineQueue.length > 0;

  useEffect(() => {
    const syncQueueOnReconnect = () =>
      NetInfo.addEventListener(async (state) => {
        try {
          if (!state.isConnected) {
            setHasInternetConnection(false);
            return;
          }

          setHasInternetConnection(true);
          await syncOfflineQueue();
          await handleGetOfflineQueue();
        } catch {}
      });

    const syncQueueOnInterval = () =>
      setInterval(async () => {
        try {
          const networkState = await NetInfo.fetch();

          if (networkState.isConnected) {
            await syncOfflineQueue();
          }

          await handleGetOfflineQueue();
        } catch {}
      }, 10_000);

    handleGetOfflineQueue();

    const unsubscribe = syncQueueOnReconnect();
    const interval = syncQueueOnInterval();

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleGetOfflineQueue = async () => {
    const offlineQueue = await getOfflineQueue();
    setOfflineQueue(offlineQueue);
  };

  const addItem = async (item: OfflineQueueItem): Promise<void> => {
    await addItemToOfflineQueue(item);
    await handleGetOfflineQueue();
  };

  return (
    <OfflineQueueContext.Provider
      value={{
        offlineQueue,
        hasInternetConnection,
        isSyncing,
        addItem,
      }}
    >
      {children}
    </OfflineQueueContext.Provider>
  );
};

export const useOfflineQueue = (): OfflineQueueContextData => useContext(OfflineQueueContext);
