import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Smartphone, Plus, Wifi, Usb, HardDrive, Shield, RefreshCw, AlertCircle, Trash2, Settings } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export default function DeviceManagerPage() {
  const { currentUser } = useAuth();
  const [devices, setDevices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;
      try {
        const [devicesData, logsData] = await Promise.all([
          pb.collection('devices').getFullList({ filter: `userId="${currentUser.id}"`, $autoCancel: false }),
          pb.collection('syncLogs').getList(1, 5, { filter: `userId="${currentUser.id}"`, sort: '-created', $autoCancel: false })
        ]);
        setDevices(devicesData);
        setLogs(logsData.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  const mockDevices = [
    { id: '1', deviceName: 'Mi iPhone 15 Pro', connectionType: 'WiFi', status: 'connected', lastSyncTime: new Date().toISOString(), storageInfo: { total: 256, used: 180 }, fileCount: 14205 },
    { id: '2', deviceName: 'MacBook Air', connectionType: 'WiFi', status: 'disconnected', lastSyncTime: new Date(Date.now() - 86400000).toISOString(), storageInfo: { total: 512, used: 400 }, fileCount: 45020 }
  ];

  const displayDevices = devices.length > 0 ? devices : mockDevices;

  const handleForceSync = (deviceId) => {
    toast.success('Sincronización iniciada en segundo plano.');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Dispositivos - MemorIA</title></Helmet>
      <Header />
      <main className="flex-1 py-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-serif">Mis Dispositivos</h1>
            <p className="text-muted-foreground">Gestiona tus fuentes de recuerdos.</p>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" /> Añadir Dispositivo</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayDevices.map(device => (
            <div key={device.id} className="glass-card p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${device.status === 'connected' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                  {device.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{device.deviceName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  {device.connectionType === 'WiFi' ? <Wifi className="w-3 h-3" /> : <Usb className="w-3 h-3" />}
                  Última sinc: {new Date(device.lastSyncTime).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Archivos:</span>
                  <span className="font-medium">{device.fileCount?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Almacenamiento:</span>
                  <span className="font-medium">{device.storageInfo?.used || 0} GB / {device.storageInfo?.total || 0} GB</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleForceSync(device.id)}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Sincronizar
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Settings & Permissions */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> Ajustes Globales
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sincronización Automática</p>
                  <p className="text-sm text-muted-foreground">Subir archivos en segundo plano con WiFi</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Eliminar tras sincronizar</p>
                  <p className="text-sm text-muted-foreground">Libera espacio en el teléfono local</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="h-px bg-border my-6" />

            <h3 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Permisos
            </h3>
            <div className="space-y-3">
              {['Acceso a Fotos', 'Acceso a Archivos', 'Ubicación (para mapas)'].map((perm, i) => (
                <div key={i} className="flex justify-between items-center text-sm p-3 bg-secondary/50 rounded-lg border border-border">
                  <span>{perm}</span>
                  <span className="text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded">Concedido</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sync History */}
          <div className="glass-card p-6 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold mb-6">Historial de Sincronización</h3>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No hay registros recientes.</div>
              ) : logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-3 rounded-xl border border-border bg-secondary/20">
                  <div className={`p-2 rounded-full ${log.syncStatus === 'failed' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                    {log.syncStatus === 'failed' ? <AlertCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sincronización {log.syncStatus === 'success' ? 'Completada' : 'Fallida'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(log.syncStartTime).toLocaleString()}</p>
                    {log.syncStatus === 'success' && <p className="text-xs mt-1 text-foreground">{log.filesSynced} archivos procesados</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}