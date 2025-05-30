export interface ISupplier {
  id: string;
  image: string;
  name: string;
  state: string;
  city: string;
  cnpj: string | null;

  phone: string | null;
  email: string | null;
  link: string | null;

  isSelected?: boolean;

  categories: {
    category: { id: string; name: string };
  }[];

  maintenances: {
    maintenance: {
      id: string;
      activity: string;
      element: string;
      Category: { name: string };
    };
  }[];
}
