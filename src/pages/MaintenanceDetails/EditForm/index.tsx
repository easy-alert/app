import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

import { PrimaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { LabelInput } from "@/components/LabelInput";
import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { updateMaintenanceDueDate } from "@/services/mutations/updateMaintenanceDueDate";
import type { IMaintenance } from "@/types/api/IMaintenance";
import { formatDate } from "@/utils/formatDate";

import { styles } from "./styles";

interface EditFormProps {
  maintenanceDetails: IMaintenance;
  onFinishEditing: () => void;
}

const formSchema = (notificationDate: Date, limitDate: Date) =>
  z.object({
    dueDate: z.date().refine((value) => {
      const normalizedDueDate = new Date(value);
      normalizedDueDate.setHours(0, 0, 0, 0);

      const normalizedNotificationDate = new Date(notificationDate);
      normalizedNotificationDate.setHours(0, 0, 0, 0);

      const normalizedLimitDate = new Date(limitDate);
      normalizedLimitDate.setHours(0, 0, 0, 0);

      return normalizedDueDate >= normalizedNotificationDate && normalizedDueDate <= normalizedLimitDate;
    }, "Data de vencimento não pode ser maior que a data limite nem menor que a data de notificação"),
  });

type FormData = z.infer<ReturnType<typeof formSchema>>;

export const EditForm = ({ maintenanceDetails, onFinishEditing }: EditFormProps) => {
  const { closeBottomSheet } = useBottomSheet();

  const handleSave = async ({ dueDate }: FormData) => {
    const { success } = await updateMaintenanceDueDate({
      id: maintenanceDetails.id,
      dueDate: dueDate.toISOString(),
      status: maintenanceDetails.MaintenancesStatus.name,
      showToResident: maintenanceDetails.showToResident,
    });

    if (success) {
      closeBottomSheet();
      onFinishEditing();
    }
  };

  const daysToAdd =
    (maintenanceDetails.Maintenance.FrequencyTimeInterval?.unitTime ?? 0) *
      (maintenanceDetails.Maintenance.frequency ?? 0) -
    1;

  const notificationDate = new Date(maintenanceDetails.notificationDate);
  const limitDate = new Date(maintenanceDetails.notificationDate);
  limitDate.setDate(limitDate.getDate() + daysToAdd);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema(notificationDate, limitDate)),
    defaultValues: {
      dueDate: new Date(maintenanceDetails.dueDate),
    },
  });

  const canChangeDueDate = maintenanceDetails.Maintenance.MaintenanceType.name !== "occasional";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar manutenção</Text>
      <Text style={styles.buildingName}>{maintenanceDetails.Building.name}</Text>

      {canChangeDueDate && (
        <>
          <Text style={styles.dueDateLabel}>
            A data limite para a manutenção é: <Text style={styles.dueDate}>{formatDate(limitDate.toISOString())}</Text>
          </Text>

          <Controller
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <LabelInput label="Data de vencimento" error={form.formState.errors.dueDate?.message}>
                <DateTimeInput
                  value={field.value.toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                  onSelectDate={field.onChange}
                />
              </LabelInput>
            )}
          />

          <PrimaryButton label="Salvar" onPress={form.handleSubmit(handleSave)} loading={form.formState.isSubmitting} />
        </>
      )}

      {!canChangeDueDate && <Text style={styles.dueDateLabel}>Manutenção avulsa não possui data de vencimento.</Text>}
    </View>
  );
};
