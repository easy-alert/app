interface ISupplier {
  id: string;
  name: string;
}

export interface IMaintenanceSuppliers {
  remainingSuppliers: ISupplier[];
  suggestedSuppliers: ISupplier[];
}
