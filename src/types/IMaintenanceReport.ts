import type { IAnnexesAndImages } from "@/types/IAnnexesAndImages";

export interface IMaintenanceReport {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexes: IAnnexesAndImages[];
  ReportImages: IAnnexesAndImages[];
}
