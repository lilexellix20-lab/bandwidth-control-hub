import { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wifi, Signal, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ClientPortal = () => {
  const { packages, createSession } = useNetwork();
  const [deviceName, setDeviceName] = useState('My Device');
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [step, setStep] = useState<'welcome' | 'plans' | 'payment'>('welcome');

  const handlePurchase = () => {
    if (selectedPkg) {
      createSession(selectedPkg, deviceName);
      setStep('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/424e466c-e790-4a0c-a266-5c04e5a13d76/network-bg-webp-f13f06a8-1777361812009.webp" 
          className="w-full h-full object-cover"
          alt="background"
        />
      </div>

      <div className="max-w-md w-full z-10">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit">
                    <Wifi className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold">High-Speed WiFi</CardTitle>
                    <CardDescription className="text-slate-400">Welcome to the Guest Network. Secure and fast access starts here.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-400">Identify your device</label>
                    <Input 
                      className="bg-slate-800 border-white/5" 
                      value={deviceName} 
                      onChange={e => setDeviceName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
                      <Signal className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs">95% Signal</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                      <span className="text-xs">WPA3 Secure</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-lg h-12" onClick={() => setStep('plans')}>
                    Get Internet Access <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 'plans' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Select a Data Plan</h3>
              {packages.map(pkg => (
                <Card 
                  key={pkg.id} 
                  className={`bg-slate-900/80 border-white/10 cursor-pointer transition-all ${selectedPkg === pkg.id ? 'ring-2 ring-primary' : 'hover:bg-slate-800'}`}
                  onClick={() => setSelectedPkg(pkg.id)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{pkg.name}</span>
                      <span className="text-xs text-slate-400">{pkg.duration} Hours Validity</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-primary border-primary">
                        {pkg.dataAmount >= 1024 ? `${(pkg.dataAmount/1024).toFixed(1)}GB` : `${pkg.dataAmount}MB`}
                      </Badge>
                      <span className="font-bold text-white text-lg">${pkg.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep('welcome')}>Back</Button>
                <Button className="flex-[2]" disabled={!selectedPkg} onClick={() => setStep('payment')}>Continue to Payment</Button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Card className="bg-slate-900/80 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Confirm Purchase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800 flex justify-between">
                    <span>Package:</span>
                    <span className="font-bold">{packages.find(p => p.id === selectedPkg)?.name}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800 flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold text-primary">${packages.find(p => p.id === selectedPkg)?.price}</span>
                  </div>
                  <p className="text-xs text-slate-400">By clicking Pay Now, you agree to the Guest Network Terms of Service.</p>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('plans')}>Back</Button>
                  <Button className="flex-[2]" onClick={handlePurchase}>Pay Now</Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};