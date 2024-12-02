import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Building = ({ navigation }: any) => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const storedBuildings = await AsyncStorage.getItem("buildingsList");

        if (storedBuildings) {
          setBuildings(JSON.parse(storedBuildings)); // Faz o parse da lista de prédios
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

    fetchBuildings();
  }, []);

  const handleBuildingSelect = async (building: any) => {
    try {
      await AsyncStorage.setItem("buildingNanoId", building.buildingNanoId);
      await AsyncStorage.setItem("syndicNanoId", building.syndicNanoId);
      await AsyncStorage.setItem("buildingName", building.buildingName);

      navigation.replace("Board");
    } catch (error) {
      console.error("Erro ao salvar dados no AsyncStorage:", error);
      Alert.alert("Erro", "Não foi possível selecionar o prédio.");
    }
  };

  const renderBuilding = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.buildingItem}
      onPress={() => handleBuildingSelect(item)}
    >
      <Text style={styles.buildingName}>{item.buildingName}</Text>
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
          keyExtractor={(item) => item.buildingNanoId}
          renderItem={renderBuilding}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma edificação encontrado para este número.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  buildingItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  buildingDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
