import type { IAnnexesAndImages } from ".";

export interface MaintenanceReport {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexes: IAnnexesAndImages[];
  ReportImages: IAnnexesAndImages[];
}
