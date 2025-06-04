import type { Filter } from "@/types/utils/Filter";

export const emptyFilters: Filter = {
  selectedBuildings: [],
  search: "",
  selectedUsers: [],
  selectedStatus: [],
  selectedCategories: [],
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
};
