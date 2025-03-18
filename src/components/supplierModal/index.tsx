import React, { useEffect, useState } from "react";

import { Modal, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import type { IMaintenanceSuppliers } from "@/types/IMaintenanceSuppliers";

import { getSuppliersForMaintenance } from "@/services/getSuppliersForMaintenance";
import { linkMaintenanceSupplier } from "@/services/linkMaintenanceSupplier";

interface SupplierModalProps {
  maintenanceId: string;
  userId: string;
  visible: boolean;
  onClose: () => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({ maintenanceId, userId, visible, onClose }) => {
  const [suppliersData, setSuppliersData] = useState<IMaintenanceSuppliers | undefined>(undefined);

  const handleGetSuppliersForMaintenance = async () => {
    try {
      const responseData = await getSuppliersForMaintenance({ maintenanceId });

      if (responseData) {
        setSuppliersData(responseData);
      }
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    }
  };

  const handleLinkMaintenanceSupplier = async (supplierId: string, userId: string) => {
    try {
      await linkMaintenanceSupplier({
        maintenanceId,
        supplierId,
        userId,
      });
    } catch (error) {
      console.error("Erro ao vincular o fornecedor:", error);
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    handleGetSuppliersForMaintenance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceId]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalFullContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Vincular fornecedor</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Icon name="x" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalSubtitle}>Clique em uma das opções abaixo para vincular o fornecedor desejado:</Text>

          <Text style={styles.sectionHeaderText}>Sugeridos</Text>
          {suppliersData?.suggestedSuppliers.map((suppliers) => (
            <TouchableOpacity
              key={suppliers.id}
              style={styles.supplierOption}
              onPress={() => handleLinkMaintenanceSupplier(suppliers.id, userId)}
            >
              <Text style={styles.supplierOptionText}>{suppliers.name}</Text>
            </TouchableOpacity>
          ))}

          {suppliersData?.suggestedSuppliers.length || (
            <Text style={styles.noSuppliersText}>Nenhum fornecedor encontrado.</Text>
          )}

          <Text style={styles.sectionHeaderText}>Outros</Text>
          {suppliersData?.remainingSuppliers.map((suppliers) => (
            <TouchableOpacity
              key={suppliers.id}
              style={styles.supplierOption}
              onPress={() => handleLinkMaintenanceSupplier(suppliers.id, userId)}
            >
              <Text style={styles.supplierOptionText}>{suppliers.name}</Text>
            </TouchableOpacity>
          ))}

          {suppliersData?.remainingSuppliers.length || (
            <Text style={styles.noSuppliersText}>Nenhum fornecedor encontrado.</Text>
          )}

          <Text style={styles.linkToRegister}>
            Não encontrou o fornecedor que procura?{" "}
            <Text style={styles.linkText} onPress={() => console.log("Cadastrar fornecedor")}>
              Clique aqui para cadastrar!
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
