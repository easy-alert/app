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
import type { ISupplier } from "@/types/api/ISupplier";

import { styles } from "./styles";

interface EditMaintenanceReportProps {
  maintenanceDetails: IMaintenance;
  onFinishEditing: () => void;
}

export const EditMaintenanceReport = ({ maintenanceDetails, onFinishEditing }: EditMaintenanceReportProps) => {
  const { closeBottomSheet } = useBottomSheet();

  const { isCompleted, isOverdue, canReport } = getMaintenanceFlags({
    maintenanceStatus: maintenanceDetails.MaintenancesStatus.name,
    maintenanceType: maintenanceDetails.Maintenance.MaintenanceType.name,
    canReport: maintenanceDetails.canReport,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar relato</Text>
    </View>
  );
};
