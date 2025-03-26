import { View, Text, TouchableOpacity, Image } from "react-native";

import React, { useState } from "react";

import Icon from "react-native-vector-icons/Feather";

import { unlinkMaintenanceSupplier } from "@/services/unlinkMaintenanceSupplier";
import { useAuth } from "@/contexts/AuthContext";

import { styles } from "./styles";

import { SupplierModal } from "../SupplierModal";

import type { ISupplier } from "@/types/ISupplier";

interface SuppliersProps {
  supplierData?: ISupplier | null;
  maintenanceId: string;
  handleGetMaintenanceSupplier: () => Promise<void>;
}

export const Suppliers = ({ supplierData, maintenanceId, handleGetMaintenanceSupplier }: SuppliersProps) => {
  const { userId } = useAuth();

  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const toggleSupplierModal = async () => {
    handleGetMaintenanceSupplier();
    setShowSupplierModal((prev) => !prev);
  };

  const handleUnlinkMaintenanceSupplier = async (supplierId: string) => {
    await unlinkMaintenanceSupplier({
      maintenanceHistoryId: maintenanceId,
      supplierId,
      userId,
    });

    await handleGetMaintenanceSupplier();
  };

  return (
    <>
      <SupplierModal maintenanceId={maintenanceId} visible={showSupplierModal} onClose={toggleSupplierModal} />

      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Fornecedor</Text>

          {supplierData ? (
            <TouchableOpacity
              onPress={() => handleUnlinkMaintenanceSupplier(supplierData.id)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.unlinkText}>Desvincular</Text>
              <Icon name="link" size={16} color="#fff" style={styles.unlinkIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.unlinkButton} onPress={toggleSupplierModal}>
              <Text style={styles.unlinkText}>Vincular</Text>
              <Icon name="link" size={16} color="#fff" style={styles.unlinkIcon} />
            </TouchableOpacity>
          )}
        </View>

        {supplierData ? (
          <View style={styles.supplierContainer}>
            <View style={styles.supplierAvatar}>
              <Image
                source={{
                  uri: supplierData.image,
                }}
                style={styles.supplierAvatarImage}
              />
            </View>
            <View style={styles.supplierDetails}>
              <Text style={styles.supplierName}>{supplierData.name}</Text>
              <Text style={styles.supplierEmail}>
                <Icon name="mail" size={12} /> {supplierData.email || "-"}
              </Text>
              <Text style={styles.supplierWebsite}>
                <Icon name="phone" size={12} /> {supplierData.phone || "-"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.supplierContainer}>
            <View style={styles.supplierDetails}>
              <Text style={styles.supplierEmail}>Nenhum fornecedor encontrado.</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
