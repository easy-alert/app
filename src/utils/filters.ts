import type { KanbanFilter } from "@/types/utils/Filter";

export const emptyFilters: KanbanFilter = {
  selectedBuildings: [],
  search: "",
  selectedUsers: [],
  selectedStatus: [],
  selectedCategories: [],
  selectedPriorityNames: [],
  selectedTypes: [],
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
};
