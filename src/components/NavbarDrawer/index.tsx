import { Modal, View, TouchableOpacity, FlatList, Linking, Text } from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import { useAuth } from "@/contexts/AuthContext";

interface NavbarDrawerProps {
  open: boolean;
  toggleOpen: () => void;
  buildingNanoId: string;
}

export const NavbarDrawer = ({ open, toggleOpen, buildingNanoId }: NavbarDrawerProps) => {
  const openWeb = () => {
    Linking.openURL(`https://public.easyalert.com.br/syndicarea/${buildingNanoId}?syndicNanoId=${userId}`);
  };

  const handleLogout = async () => {
    await logout();
    toggleOpen();
  };

  const options = [
    {
      label: "Acesso web",
      action: openWeb,
    },
    {
      label: "Sair",
      action: handleLogout,
    },
  ];

  const { logout, userId } = useAuth();

  return (
    <Modal visible={open} animationType="slide" transparent={true} onRequestClose={toggleOpen}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Opções</Text>

            <TouchableOpacity onPress={toggleOpen} style={styles.closeIcon}>
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.optionItem} onPress={item.action}>
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};
