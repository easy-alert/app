import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  StatusBar,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

interface NavbarProps {
  logoUrl: string;
  syndicNanoId: string;
  buildingNanoId: string;
}

export const Navbar: React.FC<NavbarProps> = ({ logoUrl, syndicNanoId, buildingNanoId }) => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.clear().then(() => {
      toggleModal();
      navigation.navigate("Login"); // Redireciona para a tela de login
    });
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
        <View style={styles.logoContainer}>
          <Image source={{ uri: logoUrl }} style={styles.logo} />
        </View>
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

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  navbar: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  hamburgerIcon: {
    position: "absolute",
    left: 16,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeIcon: {
    padding: 5,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
  },
});
