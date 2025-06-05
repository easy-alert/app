import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { toast } from "sonner-native";

import { useAuth } from "@/contexts/AuthContext";
import { unlinkMaintenanceSupplier } from "@/services/mutations/unlinkMaintenanceSupplier";
import type { ISupplier } from "@/types/api/ISupplier";
import { alertMessage } from "@/utils/alerts";

import { SupplierModal } from "../SupplierModal";
import { styles } from "./styles";

interface SuppliersProps {
  supplier?: ISupplier;
  maintenanceId: string;
  getMaintenanceSupplier: () => Promise<void>;
}

export const Suppliers = ({ supplier, maintenanceId, getMaintenanceSupplier }: SuppliersProps) => {
  const { userId } = useAuth();

  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const toggleSupplierModal = async () => {
    getMaintenanceSupplier();
    setShowSupplierModal((prev) => !prev);
  };

  const handleUnlinkMaintenanceSupplier = async () => {
    if (!supplier) {
      return;
    }

    const { success, message } = await unlinkMaintenanceSupplier({
      maintenanceHistoryId: maintenanceId,
      supplierId: supplier.id,
      userId,
    });

    if (success) {
      toast.success(message);
      await getMaintenanceSupplier();
    } else {
      alertMessage({ type: "error", message });
    }
  };

  return (
    <>
      <SupplierModal maintenanceId={maintenanceId} visible={showSupplierModal} onClose={toggleSupplierModal} />

      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleLabel}>Fornecedor</Text>

          {supplier ? (
            <TouchableOpacity onPress={handleUnlinkMaintenanceSupplier} style={styles.unlinkButton}>
              <Text style={styles.buttonLabel}>Desvincular</Text>
              <Icon name="link" size={16} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={toggleSupplierModal}>
              <Text style={styles.buttonLabel}>Vincular</Text>
              <Icon name="link" size={16} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          )}
        </View>

        {supplier ? (
          <View style={styles.supplierContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: supplier.image,
                }}
                style={styles.avatarImage}
              />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.nameLabel}>{supplier.name}</Text>
              <Text style={styles.emailLabel}>
                <Icon name="mail" size={12} /> {supplier.email || "-"}
              </Text>
              <Text style={styles.websiteLabel}>
                <Icon name="phone" size={12} /> {supplier.phone || "-"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.supplierContainer}>
            <View style={styles.detailsContainer}>
              <Text style={styles.emailLabel}>Nenhum fornecedor encontrado.</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
