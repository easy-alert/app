import { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";

import { getOfflineQueue } from "@/utils/offlineQueue";

import { styles } from "./styles";

import { KanbanRow } from "../KanbanRow";
import { KanbanHeader } from "../KanbanHeader";

import type { IKanbanColumn } from "@/types/IKanbanColumn";
import type { IOfflineQueueItem } from "@/types/IOfflineQueueItem";

interface KanbanProps {
  kanbanData: IKanbanColumn[];
  buildingName: string;
  buildingId: string;
}

export const Kanban = ({ kanbanData, buildingName, buildingId }: KanbanProps) => {
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
      <KanbanHeader buildingName={buildingName} buildingId={buildingId} />

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
