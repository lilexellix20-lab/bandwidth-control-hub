import { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit3, Wifi, Clock, Database, CircleDollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataPackage } from '../../lib/types';
import { toast } from 'sonner';

export const PackageList = () => {
  const { packages, addPackage, removePackage, updatePackage } = useNetwork();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<DataPackage, 'id'>>({ 
    name: '', 
    dataAmount: 1024, 
    price: 1, 
    duration: 24 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a plan name');
      return;
    }

    if (editingId) {
      updatePackage(editingId, formData);
      toast.success('Package updated successfully');
      setEditingId(null);
    } else {
      addPackage(formData);
      toast.success('New package created');
    }
    
    setShowForm(false);
    setFormData({ name: '', dataAmount: 1024, price: 1, duration: 24 });
  };

  const startEdit = (pkg: DataPackage) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      dataAmount: pkg.dataAmount,
      price: pkg.price,
      duration: pkg.duration
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', dataAmount: 1024, price: 1, duration: 24 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Service Plans</h2>
          <p className="text-muted-foreground">Manage data allocation and pricing for your network.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          {showForm ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Create Plan</>}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-card/50 border-white/10 animate-in fade-in zoom-in duration-200">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Data Package' : 'Create New Data Package'}</CardTitle>
            <CardDescription>Configure the name, data limit, price, and validity duration.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <div className="relative">
                  <Input 
                    placeholder="e.g. Weekly Pro" 
                    className="pl-9"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <Edit3 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Limit (MB)</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    className="pl-9"
                    value={formData.dataAmount}
                    onChange={e => setFormData({...formData, dataAmount: Number(e.target.value)})}
                  />
                  <Database className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($)</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    step="0.01"
                    className="pl-9"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                  <CircleDollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Validity (Hours)</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    className="pl-9"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                  />
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-end gap-3 mt-4">
                <Button type="button" variant="ghost" onClick={cancelForm}>Cancel</Button>
                <Button type="submit" className="px-8">{editingId ? 'Update Plan' : 'Create Plan'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="group relative overflow-hidden border-white/5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wifi className="h-16 w-16 text-primary -rotate-12" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" /> {pkg.duration} Hours Validity
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {pkg.dataAmount >= 1024 ? `${(pkg.dataAmount / 1024).toFixed(1)} GB` : `${pkg.dataAmount} MB`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">${pkg.price.toFixed(2)}</span>
                <span className="text-muted-foreground text-sm">USD</span>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => startEdit(pkg)}
                >
                  <Edit3 className="h-4 w-4 mr-2"/> Edit Plan
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => removePackage(pkg.id)}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};