import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { formatDate } from "@/utils/formatDate";

import type { IMaintenanceHistoryActivities } from "@/types/api/IMaintenanceHistoryActivities";

import { styles } from "./styles";

interface HistoryProps {
  historyActivities?: IMaintenanceHistoryActivities;
}

export const History = ({ historyActivities }: HistoryProps) => {
  const [activeTab, setActiveTab] = useState<"comment" | "notification">("comment");

  const filteredData = historyActivities?.maintenanceHistoryActivities?.filter((item) => item.type === activeTab);

  return (
    <View>
      <Text style={styles.titleLabel}>Históricos</Text>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "comment" && styles.activeTabButton]}
          onPress={() => setActiveTab("comment")}
        >
          <Text style={[styles.tabButtonLabel, activeTab === "comment" && styles.activeTabButtonLabel]}>
            Comentários
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "notification" && styles.activeTabButton]}
          onPress={() => setActiveTab("notification")}
        >
          <Text style={[styles.tabButtonLabel, activeTab === "notification" && styles.activeTabButtonLabel]}>
            Notificações
          </Text>
        </TouchableOpacity>
      </View>

      {filteredData && filteredData.length >= 1 && (
        <ScrollView style={styles.listContainer} nestedScrollEnabled={true}>
          {filteredData.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemIconContainer}>
                <Icon name="activity" size={20} color="#ffffff" />
              </View>

              <View style={styles.itemContentContainer}>
                <Text style={styles.itemTitleLabel}>{item.title}</Text>
                <Text style={styles.itemTimestampLabel}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.itemDescriptionLabel}>{item.content}</Text>

                {item.images && item.images.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    {item.images.map((image, index) => (
                      <View key={index} style={styles.imageItemContainer}>
                        <Image source={{ uri: image.url }} style={styles.previewImage} />

                        <Text style={styles.imageNameLabel} numberOfLines={1} ellipsizeMode="tail">
                          {image.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {(!filteredData || filteredData.length === 0) && <Text>Não há registros no momento</Text>}
    </View>
  );
};
