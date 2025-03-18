import type { IAnnexesAndImages } from ".";

// TODO: alterar para IMaintenanceReport
export interface MaintenanceReport {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexes: IAnnexesAndImages[];
  ReportImages: IAnnexesAndImages[];
}
