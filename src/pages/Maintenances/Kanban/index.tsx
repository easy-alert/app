import { ScrollView, View, Text } from "react-native";

import { IKanbanColumn } from "@/types/IKanbanColumn";

import { styles } from "./styles";

import { KanbanRow } from "../KanbanRow";
import { KanbanHeader } from "../KanbanHeader";

interface KanbanProps {
  kanbanData: IKanbanColumn[];
  buildingName: string;
  buildingId: string;
}

export const Kanban = ({ kanbanData, buildingName, buildingId }: KanbanProps) => {
  return (
    <View style={styles.container}>
      <KanbanHeader buildingName={buildingName} buildingId={buildingId} />

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {kanbanData?.map((column, index) => (
          <View key={index} style={styles.statusContainer}>
            <Text style={styles.statusTitle}>{column.status}</Text>

            <ScrollView style={styles.columnContainer} nestedScrollEnabled={true}>
              {column.maintenances.map((maintenance, index) => (
                <KanbanRow key={index} maintenance={maintenance} columnStatus={column.status} />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
