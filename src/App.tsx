import { useState } from 'react';
import { NetworkProvider } from './context/NetworkContext';
import { Dashboard } from './components/Admin/Dashboard';
import { PackageList } from './components/Admin/PackageList';
import { ClientList } from './components/Admin/ClientList';
import { ClientPortal } from './components/Portal/ClientPortal';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { 
  Wifi, 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  SwitchCamera,
  LogOut
} from 'lucide-react';

function App() {
  const [view, setView] = useState<'admin' | 'portal'>('admin');
  const [adminTab, setAdminTab] = useState<'dash' | 'pkg' | 'clients'>('dash');

  return (
    <NetworkProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Toaster position="top-center" expand={false} richColors />
        
        {view === 'admin' ? (
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 border-b lg:border-r border-white/5 p-6 bg-slate-950/50 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-12">
                <div className="p-2 bg-primary rounded-lg">
                  <Wifi className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="font-bold text-xl tracking-tight">NetAdmin</h1>
              </div>

              <nav className="space-y-2">
                <Button 
                  variant={adminTab === 'dash' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setAdminTab('dash')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
                <Button 
                  variant={adminTab === 'pkg' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setAdminTab('pkg')}
                >
                  <Package className="mr-2 h-4 w-4" /> Packages
                </Button>
                <Button 
                  variant={adminTab === 'clients' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setAdminTab('clients')}
                >
                  <Users className="mr-2 h-4 w-4" /> Clients
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </nav>

              <div className="mt-auto pt-12 space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-2">Mode Switcher</p>
                  <Button 
                    variant="outline" 
                    className="w-full text-xs h-8 border-primary/20 hover:bg-primary/10"
                    onClick={() => setView('portal')}
                  >
                    <SwitchCamera className="mr-2 h-3 w-3" /> Open Client Portal
                  </Button>
                </div>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 bg-slate-950/20">
              <header className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold capitalize">{adminTab === 'dash' ? 'Network Overview' : adminTab === 'pkg' ? 'Service Plans' : 'Connected Devices'}</h2>
                  <p className="text-muted-foreground">Managing your local internet supply hub.</p>
                </div>
                <div className="hidden md:flex gap-2">
                   <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-emerald-500">Gateway Online</span>
                      <span className="text-[10px] text-muted-foreground">IP: 192.168.1.1</span>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 animate-pulse"></div>
                </div>
              </header>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {adminTab === 'dash' && <Dashboard />}
                {adminTab === 'pkg' && <PackageList />}
                {adminTab === 'clients' && <ClientList />}
              </div>
            </main>
          </div>
        ) : (
          <div className="relative">
            <Button 
              className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/5" 
              variant="outline"
              onClick={() => setView('admin')}
            >
              Back to Admin
            </Button>
            <ClientPortal />
          </div>
        )}
      </div>
    </NetworkProvider>
  );
}

export default App;