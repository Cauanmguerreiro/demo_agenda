export interface AppFeatures {
  professionals: boolean;
  individualAgenda: boolean;
  approvalRequired: boolean;
  commissions: boolean;
  financial: boolean;
  reports: boolean;
  history: boolean;
  products: boolean;
  stock: boolean;
  reviews: boolean;
}

export const defaultFeatures: AppFeatures = {
  professionals: true,
  individualAgenda: true,
  approvalRequired: true,
  commissions: true,
  financial: true,
  reports: true,
  history: true,
  products: false,
  stock: false,
  reviews: true,
};
