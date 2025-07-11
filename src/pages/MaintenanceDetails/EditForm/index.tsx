import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "expo-checkbox";
import { toast } from "sonner-native";
import { z } from "zod";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { PrimaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { LabelInput } from "@/components/LabelInput";

import { updateMaintenanceDueDate } from "@/services/mutations/updateMaintenanceDueDate";

import { alerts } from "@/utils/alerts";
import { formatDate } from "@/utils/formatDate";
import { getMaintenanceFlags } from "@/utils/getMaintenanceFlags";

import type { IMaintenance } from "@/types/api/IMaintenance";

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
    showToResident: z.boolean(),
  });

type FormData = z.infer<ReturnType<typeof formSchema>>;

export const EditForm = ({ maintenanceDetails, onFinishEditing }: EditFormProps) => {
  const { closeBottomSheet } = useBottomSheet();

  const { isCompleted, isOverdue, isCommon, canReport } = getMaintenanceFlags({
    maintenanceStatus: maintenanceDetails.MaintenancesStatus.name,
    maintenanceType: maintenanceDetails.Maintenance.MaintenanceType.name,
    canReport: maintenanceDetails.canReport,
  });

  const handleSave = async ({ dueDate, showToResident }: FormData) => {
    const { success, message } = await updateMaintenanceDueDate({
      id: maintenanceDetails.id,
      dueDate: dueDate.toISOString(),
      status: maintenanceDetails.MaintenancesStatus.name,
      showToResident,
    });

    if (success) {
      toast.success(message);
      closeBottomSheet();
      onFinishEditing();
    } else {
      alerts.error(message);
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
      showToResident: maintenanceDetails.showToResident,
    },
  });

  const canChangeDueDate = !isCompleted && !isOverdue && canReport;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar manutenção</Text>
      <Text style={styles.buildingName}>{maintenanceDetails.Building.name}</Text>

      {canChangeDueDate &&
        (isCommon ? (
          <>
            <Text style={styles.dueDateLabel}>
              A data limite para a manutenção é:{" "}
              <Text style={styles.dueDate}>{formatDate(limitDate.toISOString())}</Text>
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
          </>
        ) : (
          <Text style={styles.dueDateLabel}>Manutenção avulsa não possui data de vencimento.</Text>
        ))}

      <Controller
        control={form.control}
        name="showToResident"
        render={({ field }) => (
          <LabelInput
            label="Exibir para o morador"
            textPosition="right"
            containerOnTouchEnd={() => field.onChange(!field.value)}
            style={styles.showToResidentLabel}
            error={form.formState.errors.showToResident?.message}
          >
            <Checkbox value={field.value} color={field.value ? "#ff3535" : undefined} />
          </LabelInput>
        )}
      />

      <PrimaryButton label="Salvar" onPress={form.handleSubmit(handleSave)} loading={form.formState.isSubmitting} />
    </View>
  );
};
