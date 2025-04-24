import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { IAvailableFilter } from "@/types/IAvailableFilter";
import type { IKanbanColumn } from "@/types/IKanbanColumn";
import type { IOfflineQueueItem } from "@/types/IOfflineQueueItem";
import { getOfflineQueue } from "@/utils/offlineQueue";

import { KanbanHeader } from "../KanbanHeader";
import { KanbanRow } from "../KanbanRow";
import { IFilter } from "../utils";
import { styles } from "./styles";

interface KanbanProps {
  kanbanData: IKanbanColumn[];
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
  availableCategories: IAvailableFilter[];
}

export const Kanban = ({ kanbanData, filters, setFilters, availableCategories }: KanbanProps) => {
  const [offlineQueue, setOfflineQueue] = useState<IOfflineQueueItem[]>([]);

  useEffect(() => {
    const handleGetOfflineQueue = async () => {
      const queue = await getOfflineQueue();
      setOfflineQueue(queue);
    };

    handleGetOfflineQueue();
  }, []);

  return (
    <View style={styles.container}>
      <KanbanHeader filters={filters} setFilters={setFilters} availableCategories={availableCategories} />

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {kanbanData?.map((column, index) => (
          <View key={index} style={styles.statusContainer}>
            <Text style={styles.statusTitle}>{column.status}</Text>

            <ScrollView style={styles.columnContainer} nestedScrollEnabled={true}>
              {column.maintenances.map((maintenance, index) => (
                <KanbanRow
                  key={index}
                  maintenance={maintenance}
                  columnStatus={column.status}
                  hasPendingSync={offlineQueue.some((item) => item.maintenanceId === maintenance.id)}
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
