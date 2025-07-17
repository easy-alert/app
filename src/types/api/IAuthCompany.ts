export interface IAuthCompany {
  id: string;

  image: string;
  name: string;
  contactNumber: string;
  CNPJ?: string;
  CPF?: string;

  ticketInfo: string;
  ticketType: string;

  isBlocked: boolean;
  canAccessChecklists: boolean;
  canAccessTickets: boolean;
  showMaintenancePriority: boolean;

  createdAt: string;
}
