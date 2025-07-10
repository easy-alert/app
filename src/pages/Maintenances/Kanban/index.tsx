import Checkbox from "expo-checkbox";
import { useState } from "react";
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

  const [showOldExpired, setShowOldExpired] = useState(false);
  const [showFuture, setShowFuture] = useState(false);

  return (
    <View style={styles.container}>
      <KanbanHeader filters={filters} setFilters={setFilters} availableCategories={availableCategories} />

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {kanbanData?.map((column, index) => (
          <View key={index} style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>{`${column.status} (${column.maintenances.length})`}</Text>

              {column.status === "Vencidas" && (
                <View style={styles.checkboxContainer}>
                  <Text style={styles.checkboxText}>Mostrar expiradas</Text>
                  <Checkbox
                    style={styles.checkbox}
                    color={showOldExpired ? "#FF0000" : undefined}
                    value={showOldExpired}
                    onValueChange={setShowOldExpired}
                  />
                </View>
              )}

              {column.status === "Pendentes" && (
                <View style={styles.checkboxContainer}>
                  <Text style={styles.checkboxText}>Mostrar futuras</Text>
                  <Checkbox
                    style={styles.checkbox}
                    color={showFuture ? "#FEA628" : undefined}
                    value={showFuture}
                    onValueChange={setShowFuture}
                  />
                </View>
              )}
            </View>

            <ScrollView style={styles.columnContainer} nestedScrollEnabled={true}>
              {column.maintenances.map((maintenance, index) => (
                <KanbanRow
                  key={index}
                  maintenance={maintenance}
                  columnStatus={column.status}
                  hasPendingSync={offlineQueue.some((item) => item.maintenanceId === maintenance.id)}
                  showOldExpired={showOldExpired}
                  showFuture={showFuture}
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
