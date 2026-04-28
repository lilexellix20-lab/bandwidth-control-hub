export interface DataPackage {
  id: string;
  name: string;
  dataAmount: number; // in MB
  price: number;
  duration: number; // in hours
}

export interface ClientSession {
  id: string;
  macAddress: string;
  deviceName: string;
  dataConsumed: number; // in MB
  dataLimit: number; // in MB
  startTime: string;
  status: 'active' | 'expired' | 'blocked';
}

export interface NetworkStats {
  totalDataSupplied: number;
  activeClients: number;
  totalRevenue: number;
  bandwidthUsage: number; // percentage
}