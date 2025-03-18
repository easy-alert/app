interface IImageHistory {
  id: string;
  name: string;
  url: string;
}

interface IMaintenanceHistory {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: IImageHistory[];
}

export interface IMaintenanceHistoryActivities {
  maintenanceHistoryActivities: IMaintenanceHistory[];
}
