import { useNetwork } from '../../context/NetworkContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Database, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const Dashboard = () => {
  const { stats, sessions } = useNetwork();

  const cards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500' },
    { title: 'Active Clients', value: stats.activeClients, icon: Users, color: 'text-blue-500' },
    { title: 'Data Supplied', value: `${(stats.totalDataSupplied / 1024).toFixed(1)} GB`, icon: Database, color: 'text-purple-500' },
    { title: 'Bandwidth', value: `${stats.bandwidthUsage}%`, icon: Activity, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="bg-card/50 backdrop-blur-sm border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle>Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.slice(0, 4).map(session => (
              <div key={session.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{session.deviceName}</span>
                  <span className="text-muted-foreground">
                    {Math.round(session.dataConsumed)}MB / {session.dataLimit}MB
                  </span>
                </div>
                <Progress value={(session.dataConsumed / session.dataLimit) * 100} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle>Network Health</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"
                style={{ animationDuration: '3s' }}
              ></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-500">98%</span>
                <span className="text-[10px] uppercase text-muted-foreground">Uptime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};