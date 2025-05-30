export interface IMaintenanceHistoryActivities {
  maintenanceHistoryActivities: {
    id: string;
    type: string;
    title: string;
    content: string;
    createdAt: string;
    images: {
      id: string;
      name: string;
      url: string;
    }[];
  }[];
}
