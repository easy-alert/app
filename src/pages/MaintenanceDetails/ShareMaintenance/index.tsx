import React from "react";
import { Text, TextInput, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { toast } from "sonner-native";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { PrimaryButton } from "@/components/Button";

import { styles } from "./styles";

interface ShareMaintenanceProps {
  maintenanceId: string;
}

export const ShareMaintenance = ({ maintenanceId }: ShareMaintenanceProps) => {
  const { closeBottomSheet } = useBottomSheet();

  const maintenanceLink = `${process.env.EXPO_PUBLIC_CLIENT_URL}/guest-maintenance-history/${maintenanceId}`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(maintenanceLink);
    closeBottomSheet();
    toast.success("Link copiado para a área de transferência");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compartilhar manutenção</Text>

      <TextInput
        placeholder="Link da manutenção"
        value={maintenanceLink}
        multiline={true}
        numberOfLines={10}
        style={styles.textArea}
        editable={false}
      />

      <PrimaryButton label="Copiar link" onPress={copyToClipboard} />
    </View>
  );
};
