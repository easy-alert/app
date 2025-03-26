import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

import { useState } from "react";

import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import type { IMaintenanceHistoryActivities } from "@/types/IMaintenanceHistoryActivities";

import { formatDate } from "@/utils/formatDate";

interface HistoryProps {
  historyActivities?: IMaintenanceHistoryActivities;
}

export const History = ({ historyActivities }: HistoryProps) => {
  const [activeTab, setActiveTab] = useState<"comment" | "notification">("comment");
  const filteredData = historyActivities?.maintenanceHistoryActivities?.filter((item) => item.type === activeTab);

  return (
    <View>
      {/* Históricos */}
      <Text style={styles.sectionHeaderText}>Históricos</Text>

      {/* Botões de filtro */}
      <View style={styles.historyTabs}>
        <TouchableOpacity
          style={[styles.historyTabButton, activeTab === "comment" && styles.activeTabButton]}
          onPress={() => setActiveTab("comment")}
        >
          <Text style={[styles.historyTabText, activeTab === "comment" && styles.activeTabText]}>Comentários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.historyTabButton, activeTab === "notification" && styles.activeTabButton]}
          onPress={() => setActiveTab("notification")}
        >
          <Text style={[styles.historyTabText, activeTab === "notification" && styles.activeTabText]}>
            Notificações
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de históricos */}
      <View style={styles.historyList}>
        <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
          {filteredData && filteredData?.length >= 1 ? (
            filteredData.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyIconContainer}>
                  <Icon name="activity" size={20} color="#ffffff" />
                </View>

                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyTimestamp}>{formatDate(item.createdAt)}</Text>
                  <Text style={styles.historyDescription}>{item.content}</Text>

                  {/* Renderizar imagens, se existirem */}
                  {item.images && item.images.length > 0 && (
                    <View style={styles.imagePreviewContainer}>
                      {item.images.map((image) => (
                        <View key={image.id} style={styles.imageItem}>
                          <Image source={{ uri: image.url }} style={styles.previewImage} />
                          <Text
                            style={styles.imageName}
                            numberOfLines={1} // Limita a uma linha
                            ellipsizeMode="tail"
                          >
                            {image.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text>Não há registros no momento</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
