import type { IAnnexesAndImages } from "@/types/IAnnexesAndImages";

export interface IOccasionalMaintenanceData {
  buildingId: string;

  element: string;
  activity: string;
  responsible: string;
  executionDate: string;

  inProgress: boolean;

  priorityName: string;

  categoryData: {
    id: string;
    name: string;
  };

  reportData: {
    cost: string;
    observation: string;
    files: IAnnexesAndImages[];
    images: IAnnexesAndImages[];
  };

  users: string[];
}
