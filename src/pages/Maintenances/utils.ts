export interface IFilter {
  search: string;
  selectedUsers: string[];
  selectedStatus: string[];
  selectedCategories: string[];
  selectedPriorities: string[];
  startDate: string;
  endDate: string;
}

export const emptyFilters: IFilter = {
  search: "",
  selectedUsers: [],
  selectedStatus: [],
  selectedCategories: [],
  selectedPriorities: [],
  startDate: new Date().toISOString(), // TODO: change to default dates
  endDate: new Date().toISOString(),
};
