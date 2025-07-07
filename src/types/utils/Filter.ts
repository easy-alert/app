export interface KanbanFilter {
  selectedBuildings: string[];
  search: string;
  selectedUsers: string[];
  selectedStatus: string[];
  selectedCategories: string[];
  selectedPriorityNames?: string[];
  selectedTypes?: string[];
  startDate: string;
  endDate: string;
}
