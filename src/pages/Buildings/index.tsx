import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";

import { styles } from "./styles";

import type { IUser } from "@/types/IUser";
import type { Navigation } from "@/routes/navigation";

export const Buildings = () => {
  const navigation = useNavigation<Navigation>();

  const [buildings, setBuildings] = useState<IUser["UserBuildingsPermissions"]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetBuildings = async () => {
    try {
      const storedBuildings = await AsyncStorage.getItem("buildingsList");

      if (storedBuildings) {
        setBuildings(JSON.parse(storedBuildings));
      } else {
        Alert.alert("Erro", "Nenhum prédio encontrado.");
      }
    } catch (error) {
      console.error("Erro ao carregar a lista de prédios:", error);
      Alert.alert("Erro", "Não foi possível carregar os prédios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetBuildings();
  }, []);

  const handleBuildingSelect = async (building: any) => {
    try {
      await AsyncStorage.setItem("buildingId", building.Building.id);
      await AsyncStorage.setItem("buildingName", building.Building.name);

      navigation.replace("Maintenances");
    } catch (error) {
      console.error("Erro ao salvar dados no AsyncStorage:", error);
      Alert.alert("Erro", "Não foi possível selecionar o prédio.");
    }
  };

  const renderBuilding = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.buildingItem} onPress={() => handleBuildingSelect(item)}>
      <Text style={styles.buildingName}>{item.Building.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#c62828" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Escolha uma Edificação</Text>
        <FlatList
          data={buildings}
          keyExtractor={(building) => building?.Building?.id}
          renderItem={renderBuilding}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma edificação encontrado para este número.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};
