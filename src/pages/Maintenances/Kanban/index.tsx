import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Checkbox from "expo-checkbox";

import { useOfflineQueue } from "@/contexts/OfflineQueueContext";

import { LabelInput } from "@/components/LabelInput";

import { handleTranslate } from "@/utils/handleTranslate";

import type { IKanbanColumn } from "@/types/api/IKanbanColumn";
import type { AvailableFilter } from "@/types/utils/AvailableFilter";
import type { KanbanFilter } from "@/types/utils/Filter";
import type { IMaintenancesLength } from "@/types/utils/IMaintenancesLength";

import { KanbanHeader } from "../KanbanHeader";
import { KanbanRow } from "../KanbanRow";
import { styles } from "./styles";

interface KanbanProps {
  kanbanData: IKanbanColumn[];
  filters: KanbanFilter;
  availableCategories: AvailableFilter[];
  maintenancesLength: IMaintenancesLength;
  setFilters: (filters: KanbanFilter) => void;
  handleChangeMaintenancesLength: (key: string, value: number) => void;
}

export const Kanban = ({
  kanbanData,
  filters,
  availableCategories,
  maintenancesLength,
  setFilters,
  handleChangeMaintenancesLength,
}: KanbanProps) => {
  const { offlineQueue } = useOfflineQueue();

  const [showOldExpired, setShowOldExpired] = useState(false);
  const [showFuture, setShowFuture] = useState(false);

  const handleFutureCheckboxChange = (value: boolean) => {
    setShowFuture(value);
    handleChangeMaintenancesLength(
      "pending",
      value
        ? maintenancesLength.pending + maintenancesLength.future
        : maintenancesLength.pending - maintenancesLength.future,
    );
  };

  return (
    <View style={styles.container}>
      <KanbanHeader filters={filters} setFilters={setFilters} availableCategories={availableCategories} />

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {kanbanData?.map((column, index) => (
          <View key={index} style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <Text
                style={styles.statusTitle}
              >{`${column.status === "Vencidas" ? "Vencidas/Expiradas" : column.status} (${maintenancesLength[handleTranslate(column.status) as keyof IMaintenancesLength]})`}</Text>

              {column.status === "Vencidas" && (
                <LabelInput
                  label=""
                  containerOnTouchEnd={() => setShowOldExpired(!showOldExpired)}
                  style={styles.checkboxContainer}
                >
                  <Text style={styles.checkboxText}>Mostrar expiradas</Text>
                  <Checkbox value={showOldExpired} color={showOldExpired ? "#ff3535" : undefined} />
                </LabelInput>
              )}

              {column.status === "Pendentes" && (
                <LabelInput
                  label=""
                  containerOnTouchEnd={() => handleFutureCheckboxChange(!showFuture)}
                  style={styles.checkboxContainer}
                >
                  <Text style={styles.checkboxText}>Mostrar futuras</Text>
                  <Checkbox value={showFuture} color={showFuture ? "#FEA628" : undefined} />
                </LabelInput>
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
