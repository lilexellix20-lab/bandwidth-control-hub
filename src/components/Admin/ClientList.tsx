import { useNetwork } from '../../context/NetworkContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Ban, ShieldCheck, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ClientList = () => {
  const { sessions, terminateSession, toggleBlockClient } = useNetwork();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>;
      case 'expired': return <Badge variant="secondary">Expired</Badge>;
      case 'blocked': return <Badge variant="destructive">Blocked</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Access</h2>
      </div>

      <div className="rounded-md border border-white/5 bg-card/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5">
              <TableHead>Device</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="border-white/5">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{session.deviceName}</span>
                    <span className="text-[10px] text-muted-foreground">Connected {new Date(session.startTime).toLocaleTimeString()}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{session.macAddress}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">{Math.round(session.dataConsumed)}MB / {session.dataLimit}MB</span>
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(session.dataConsumed / session.dataLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(session.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Manage Client</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toggleBlockClient(session.id)}>
                        {session.status === 'blocked' ? <><ShieldCheck className="mr-2 h-4 w-4" /> Unblock Client</> : <><Ban className="mr-2 h-4 w-4" /> Block Client</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => terminateSession(session.id)}>
                        <XCircle className="mr-2 h-4 w-4" /> Kill Session
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};