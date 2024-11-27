// SupplierModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "./styles";
import { SuppliersByMaintenanceId } from "../../types";
import { getSuppliersToSelectByMaintenanceId } from "../../services/getSuppliersToSelectByMaintenanceId";
import { addSuppliersToMaintenance } from "../../services/addSuppliersToMaintenance";

interface SupplierModalProps {
  visible: boolean;
  onClose: () => void;
  maintenanceId: string;
}

const SupplierModal: React.FC<SupplierModalProps> = ({
  visible,
  onClose,
  maintenanceId,
}) => {
  const [suppliersData, setSuppliersData] = useState<
    SuppliersByMaintenanceId | undefined
  >(undefined);

  const addSupplier = async (syndicNanoId: string, supplierId: string) => {
    if (maintenanceId && syndicNanoId && supplierId) {
      try {
        await addSuppliersToMaintenance(
          maintenanceId,
          syndicNanoId,
          supplierId
        );
        console.log("Fornecedor adicionado com sucesso");

        // Recarregar os dados do modal
        onClose();
      } catch (error) {
        console.error("Erro ao adicionar fornecedor:", error);
      }
    } else {
      console.error("Maintenance ID ou Supplier ID está indefinido.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const suppliersData = await getSuppliersToSelectByMaintenanceId(
          maintenanceId
        );

        if (suppliersData) {
          setSuppliersData(suppliersData);
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    fetchData();
  }, [maintenanceId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalFullContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Vincular fornecedor</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Icon name="x" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalSubtitle}>
            Clique em uma das opções abaixo para vincular o fornecedor desejado:
          </Text>

          <Text style={styles.sectionHeaderText}>Sugeridos</Text>
          {suppliersData?.suggestedSuppliers.map((suppliers) => (
            <TouchableOpacity
              key={suppliers.id}
              style={styles.supplierOption}
              onPress={() => {
                addSupplier("Fr8aLc-krzQn", suppliers.id);
              }}
            >
              <Text style={styles.supplierOptionText}>{suppliers.name}</Text>
            </TouchableOpacity>
          ))}
          {suppliersData?.suggestedSuppliers.length || (
            <Text style={styles.noSuppliersText}>
              Nenhum fornecedor encontrado.
            </Text>
          )}

          <Text style={styles.sectionHeaderText}>Outros</Text>
          {suppliersData?.remainingSuppliers.map((suppliers) => (
            <TouchableOpacity
              key={suppliers.id}
              style={styles.supplierOption}
              onPress={() => {
                addSupplier("Fr8aLc-krzQn", suppliers.id);
              }}
            >
              <Text style={styles.supplierOptionText}>{suppliers.name}</Text>
            </TouchableOpacity>
          ))}
          {suppliersData?.remainingSuppliers.length || (
            <Text style={styles.noSuppliersText}>
              Nenhum fornecedor encontrado.
            </Text>
          )}

          <Text style={styles.linkToRegister}>
            Não encontrou o fornecedor que procura?{" "}
            <Text
              style={styles.linkText}
              onPress={() => console.log("Cadastrar fornecedor")}
            >
              Clique aqui para cadastrar!
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default SupplierModal;
