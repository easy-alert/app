import { ScrollView, Text, View } from "react-native";

import { useOfflineQueue } from "@/contexts/OfflineQueueContext";
import type { IKanbanColumn } from "@/types/api/IKanbanColumn";
import type { AvailableFilter } from "@/types/utils/AvailableFilter";
import type { KanbanFilter } from "@/types/utils/Filter";

import { KanbanHeader } from "../KanbanHeader";
import { KanbanRow } from "../KanbanRow";
import { styles } from "./styles";

interface KanbanProps {
  kanbanData: IKanbanColumn[];
  filters: KanbanFilter;
  availableCategories: AvailableFilter[];
  setFilters: (filters: KanbanFilter) => void;
}

export const Kanban = ({ kanbanData, filters, setFilters, availableCategories }: KanbanProps) => {
  const { offlineQueue } = useOfflineQueue();

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
