import type { IKanbanColumn } from "./IKanbanColumn";

export interface IMaintenancesKanban {
  kanban: IKanbanColumn[];
  maintenanceCategoriesForSelect: {
    id: string;
    name: string;
  }[];
}
