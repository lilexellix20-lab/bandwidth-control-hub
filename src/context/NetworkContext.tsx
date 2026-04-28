import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataPackage, ClientSession, NetworkStats } from '../lib/types';
import { toast } from 'sonner';

interface NetworkContextType {
  packages: DataPackage[];
  sessions: ClientSession[];
  stats: NetworkStats;
  addPackage: (pkg: Omit<DataPackage, 'id'>) => void;
  removePackage: (id: string) => void;
  updatePackage: (id: string, pkg: Partial<DataPackage>) => void;
  createSession: (pkgId: string, deviceName: string) => void;
  terminateSession: (id: string) => void;
  toggleBlockClient: (id: string) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const INITIAL_PACKAGES: DataPackage[] = [
  { id: '1', name: 'Lite Access', dataAmount: 1024, price: 0.99, duration: 24 },
  { id: '2', name: 'Standard Surfer', dataAmount: 5120, price: 2.50, duration: 48 },
  { id: '3', name: 'Power User', dataAmount: 20480, price: 7.99, duration: 168 },
];

const INITIAL_SESSIONS: ClientSession[] = [
  {
    id: 's1',
    macAddress: '00:1A:2B:3C:4D:5E',
    deviceName: 'iPhone 15 Pro',
    dataConsumed: 124,
    dataLimit: 1024,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'active',
  },
  {
    id: 's2',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    deviceName: 'MacBook Air M2',
    dataConsumed: 1850,
    dataLimit: 5120,
    startTime: new Date(Date.now() - 7200000).toISOString(),
    status: 'active',
  },
];

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<DataPackage[]>(INITIAL_PACKAGES);
  const [sessions, setSessions] = useState<ClientSession[]>(INITIAL_SESSIONS);
  const [stats, setStats] = useState<NetworkStats>({
    totalDataSupplied: 450000, // MB
    activeClients: 2,
    totalRevenue: 342.50,
    bandwidthUsage: 65,
  });

  const addPackage = (pkg: Omit<DataPackage, 'id'>) => {
    const newPkg = { ...pkg, id: Math.random().toString(36).substr(2, 9) };
    setPackages([...packages, newPkg]);
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
    toast.info('Package removed');
  };

  const updatePackage = (id: string, updates: Partial<DataPackage>) => {
    setPackages(packages.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const createSession = (pkgId: string, deviceName: string) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (!pkg) return;

    const newSession: ClientSession = {
      id: `s-${Math.random().toString(36).substr(2, 5)}`,
      macAddress: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase(),
      deviceName,
      dataConsumed: 0,
      dataLimit: pkg.dataAmount,
      startTime: new Date().toISOString(),
      status: 'active',
    };

    setSessions([newSession, ...sessions]);
    setStats(prev => ({
      ...prev,
      activeClients: prev.activeClients + 1,
      totalRevenue: prev.totalRevenue + pkg.price,
    }));
    toast.success(`Connected! ${pkg.name} activated.`);
  };

  const terminateSession = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, status: 'expired' } : s));
    setStats(prev => ({ ...prev, activeClients: Math.max(0, prev.activeClients - 1) }));
    toast.info('Session terminated');
  };

  const toggleBlockClient = (id: string) => {
    setSessions(sessions.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'blocked' ? 'active' : 'blocked';
        toast(newStatus === 'blocked' ? 'Client blocked' : 'Client unblocked');
        return { ...s, status: newStatus as any };
      }
      return s;
    }));
  };

  // Mock real-time data consumption
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions(prev => prev.map(s => {
        if (s.status === 'active') {
          const increment = Math.random() * 5;
          const newConsumed = Math.min(s.dataLimit, s.dataConsumed + increment);
          return {
            ...s,
            dataConsumed: newConsumed,
            status: newConsumed >= s.dataLimit ? 'expired' : 'active'
          };
        }
        return s;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkContext.Provider value={{
      packages,
      sessions,
      stats,
      addPackage,
      removePackage,
      updatePackage,
      createSession,
      terminateSession,
      toggleBlockClient
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within a NetworkProvider');
  return context;
};