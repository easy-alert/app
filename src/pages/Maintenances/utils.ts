export interface IFilter {
  search: string;
  selectedUsers: string[];
  selectedStatus: string[];
  selectedCategories: string[];
  startDate: string;
  endDate: string;
}

export const emptyFilters: IFilter = {
  search: "",
  selectedUsers: [],
  selectedStatus: [],
  selectedCategories: [],
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
};
