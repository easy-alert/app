export interface ICategory {
  id?: string;

  ownerCompanyId?: string;
  categoryTypeId?: string;

  name?: string;

  createdAt?: string;
  updatedAt?: string;

  // OwnerCompany?: ICompany;
  // Maintenances?: IMaintenance[];
  // Buildings?: IBuildingCategory[];
  // DefaultTemplateCategory: IDefaultTemplateCategory[];
  // suppliers: ICategorySupplier[];
}
