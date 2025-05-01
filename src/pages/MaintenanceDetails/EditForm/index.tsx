import { useState } from "react";
import React from "react";
import { Text, View } from "react-native";

import { PrimaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { LabelInput } from "@/components/LabelInput";
import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { updateMaintenanceDueDate } from "@/services/updateMaintenanceDueDate";
import type { IMaintenance } from "@/types/IMaintenance";
import { formatDate } from "@/utils/formatDate";

import { styles } from "./styles";

interface EditFormProps {
  maintenanceDetails: IMaintenance;
  onFinishEditing: () => void;
}

export const EditForm = ({ maintenanceDetails, onFinishEditing }: EditFormProps) => {
  const { closeBottomSheet } = useBottomSheet();

  const [dueDate, setDueDate] = useState(maintenanceDetails.dueDate);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateMaintenanceDueDate({
        id: maintenanceDetails.id,
        dueDate,
        status: maintenanceDetails.MaintenancesStatus.name,
      });

      closeBottomSheet();
      onFinishEditing();
    } finally {
      setLoading(false);
    }
  };

  const canChangeDueDate = maintenanceDetails.Maintenance.MaintenanceType.name !== "occasional";

  // TODO: corrigir dueDate

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar manutenção</Text>
      <Text style={styles.buildingName}>{maintenanceDetails.Building.name}</Text>

      {canChangeDueDate && (
        <>
          <Text style={styles.dueDateLabel}>
            A data limite para a manutenção é:{" "}
            <Text style={styles.dueDate}>{formatDate(maintenanceDetails.dueDate)}</Text>
          </Text>
          <LabelInput label="Data de vencimento">
            <DateTimeInput
              value={new Date(dueDate).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })}
              onSelectDate={(date) => setDueDate(date.toISOString())}
            />
          </LabelInput>

          <PrimaryButton label="Salvar" onPress={handleSave} loading={loading} />
        </>
      )}

      {!canChangeDueDate && <Text style={styles.dueDateLabel}>Manutenção avulsa não possui data de vencimento.</Text>}
    </View>
  );
};
