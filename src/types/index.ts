export type VehicleStatus = 'DISPONIVEL' | 'RESERVADO' | 'VENDIDO';
export type FuelType = 'FLEX' | 'GASOLINA' | 'ETANOL' | 'DIESEL' | 'HIBRIDO' | 'ELETRICO';
export type TransmissionType = 'AUTOMATICO' | 'MANUAL' | 'CVT' | 'SEMI_AUTOMATICO' | 'DUPLA_EMBREAGEM';
export type BodyType = 'SUV' | 'SEDAN' | 'HATCH' | 'PICKUP' | 'COUPE' | 'CONVERSIVEL' | 'VAN' | 'MINIVAN' | 'OUTRO';

export interface VehicleMedia {
  id: string;
  vehicle_id: string;
  type: 'image' | 'video';
  url: string;
  storage_path?: string;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
}

export interface VehicleFeature {
  id: string;
  vehicle_id: string;
  feature_name: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  model_year: number;
  price: number;
  promotional_price?: number | null;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  body_type: BodyType;
  color: string;
  engine: string;
  power: string;
  traction: string;
  doors: number;
  plate_end: string;
  description: string;
  status: VehicleStatus;
  featured: boolean;
  is_offer: boolean;
  video_url?: string | null;
  created_at: string;
  updated_at: string;
  // Joins / Populated
  media?: VehicleMedia[];
  features?: string[];
  primary_image?: string;
  secondary_image?: string;
}

export type LeadStatus = 'NOVO' | 'EM_ATENDIMENTO' | 'RESPONDIDO' | 'FINALIZADO';

export interface Lead {
  id: string;
  vehicle_id?: string | null;
  vehicle_title?: string | null;
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  message: string;
  status: LeadStatus;
  created_at: string;
}

export type ProposalStatus = 'NOVA' | 'EM_ANALISE' | 'NEGOCIANDO' | 'APROVADA' | 'RECUSADA' | 'FINALIZADA';

export interface Proposal {
  id: string;
  vehicle_id: string;
  vehicle_title?: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  proposal_value: number;
  down_payment: number;
  installments_count?: number;
  message?: string;
  status: ProposalStatus;
  created_at: string;
}

export interface SiteSettings {
  id?: string;
  store_name: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  opening_hours: string;
  logo_url?: string;
  favicon_url?: string;
  seo_title: string;
  seo_description: string;
  og_image?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'ADMIN' | 'GERENTE';
  email?: string;
  name?: string;
  created_at: string;
}

export interface VehicleFilterState {
  search?: string;
  brand?: string;
  model?: string;
  body_type?: BodyType | '';
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  max_mileage?: number;
  transmission?: TransmissionType | '';
  fuel?: FuelType | '';
  color?: string;
  status?: VehicleStatus | '';
  featured?: boolean;
  is_offer?: boolean;
  selected_features?: string[];
  sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'mileage_desc';
}

export interface FinancingSimulationResult {
  vehiclePrice: number;
  downPayment: number;
  financedAmount: number;
  installmentsCount: number;
  monthlyInterestRate: number;
  monthlyPayment: number;
  totalFinanced: number;
  totalInterest: number;
}
