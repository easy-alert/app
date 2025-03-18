import React, { useState } from "react";
import { View, Image, SafeAreaView, Modal, Text, TouchableOpacity, FlatList, Linking } from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import { useAuth } from "@/contexts/authContext";

interface NavbarProps {
  logoUrl: string;
  syndicNanoId: string;
  buildingNanoId: string;
}

export const Navbar: React.FC<NavbarProps> = ({ logoUrl, syndicNanoId, buildingNanoId }) => {
  const { logout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    toggleModal();
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  const options = [
    { id: "1", label: "Acesso web" },
    { id: "6", label: "Sair" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleModal} style={styles.hamburgerIcon}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>{logoUrl && <Image source={{ uri: logoUrl }} style={styles.logo} />}</View>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Opções</Text>
              <TouchableOpacity onPress={toggleModal} style={styles.closeIcon}>
                <Icon name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    if (item.id === "6") {
                      handleLogout();
                    }
                    if (item.id === "1") {
                      Linking.openURL(
                        `https://public.easyalert.com.br/syndicarea/${buildingNanoId}?syndicNanoId=${syndicNanoId}`,
                      );
                    }
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
