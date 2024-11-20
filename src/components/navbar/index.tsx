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
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Biblioteca de ícones Feather

interface NavbarProps {
  logoUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({ logoUrl }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Lista de opções do modal
  const options = [
    { id: "1", label: "QRCode" },
    { id: "2", label: "Chamados" },
    { id: "3", label: "Checklists" },
    { id: "4", label: "Configurações" },
    { id: "5", label: "Fornecedores" },
  ];

  // Função para abrir e fechar o modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        {/* Ícone de hambúrguer à esquerda */}
        <TouchableOpacity onPress={toggleModal} style={styles.hamburgerIcon}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>

        {/* Logo centralizada */}
        <View style={styles.logoContainer}>
          <Image source={{ uri: logoUrl }} style={styles.logo} />
        </View>
      </View>

      {/* Modal com a lista de opções */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Título do modal e botão de fechar */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Opções</Text>
              <TouchableOpacity onPress={toggleModal} style={styles.closeIcon}>
                <Icon name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Lista de opções */}
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={toggleModal}
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
  },
  navbar: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Alinha itens horizontalmente no centro
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  hamburgerIcon: {
    position: "absolute",
    left: 16, // Posiciona o ícone na esquerda
  },
  logoContainer: {
    flex: 1, // Garante que o container ocupe toda a largura
    alignItems: "center", // Centraliza o conteúdo dentro do container
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

export default Navbar;
