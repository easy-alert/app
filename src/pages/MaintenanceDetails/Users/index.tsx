import { Image, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import type { IMaintenance } from "@/types/api/IMaintenance";

import { styles } from "./styles";

interface UsersProps {
  maintenanceDetails: IMaintenance;
}

export const Users = ({ maintenanceDetails }: UsersProps) => {
  if (maintenanceDetails.Users.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleLabel}>Usuários Responsáveis</Text>

      {maintenanceDetails.Users.map((user, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardImageContainer}>
            {user.User.image ? (
              <Image style={styles.image} source={{ uri: user.User.image }} />
            ) : (
              <Icon name="user" size={30} color="#fff" />
            )}
          </View>

          <View style={styles.separator} />

          <View style={styles.cardTextContainer}>
            <View>
              <Text>Usuário</Text>
              <Text style={styles.cardLabel}>{user.User.name}</Text>
            </View>

            <View>
              <Text>Email</Text>
              <Text style={styles.cardLabel}>{user.User.email}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
