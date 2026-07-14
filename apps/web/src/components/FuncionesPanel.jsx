
import React, { useState } from 'react';
import { X, Upload, Sparkles, Video, Share2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadComponent from './FileUploadComponent.jsx';
import IntegratedAiChat from './integrated-ai-chat.jsx';

export default function FuncionesPanel({ isOpen, onClose, onUploadSuccess }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedImages, setSelectedImages] = useState([]);
  const [familyEmail, setFamilyEmail] = useState('');
  const [permissions, setPermissions] = useState('view');

  const handleShareInvite = () => {
    if (!familyEmail) return;
    // Placeholder for sharing functionality
    console.log('Sharing with:', familyEmail, 'Permissions:', permissions);
    setFamilyEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-heading font-bold text-foreground">Funciones</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="upload" className="text-xs sm:text-sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Subir
                  </TabsTrigger>
                  <TabsTrigger value="stories" className="text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Historias
                  </TabsTrigger>
                  <TabsTrigger value="presentations" className="text-xs sm:text-sm">
                    <Video className="w-4 h-4 mr-1" />
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="share" className="text-xs sm:text-sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartir
                  </TabsTrigger>
                </TabsList>

                {/* Upload Tab */}
                <TabsContent value="upload" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Subir Medios</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Arrastra archivos o selecciónalos para subirlos a tu bóveda encriptada.
                    </p>
                  </div>
                  <FileUploadComponent onUploadSuccess={onUploadSuccess} />
                </TabsContent>

                {/* Stories Tab */}
                <TabsContent value="stories" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Historias IA</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Genera narrativas automáticas a partir de tus fotos y recuerdos.
                    </p>
                  </div>
                  
                  <div className="bg-card border border-border rounded-xl overflow-hidden h-[500px]">
                    <IntegratedAiChat />
                  </div>
                </TabsContent>

                {/* Presentations Tab */}
                <TabsContent value="presentations" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Presentaciones</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Crea videos automáticos con música y transiciones.
                    </p>
                  </div>

                  <div className="bg-muted/30 border-2 border-dashed border-border rounded-2xl p-12 text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="font-semibold text-foreground mb-2">Próximamente</h4>
                    <p className="text-sm text-muted-foreground">
                      La creación automática de videos estará disponible pronto.
                    </p>
                  </div>
                </TabsContent>

                {/* Share Tab */}
                <TabsContent value="share" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Compartir Seguro</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Invita a familiares y controla qué pueden ver o editar.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Correo del familiar</label>
                      <input
                        type="email"
                        value={familyEmail}
                        onChange={(e) => setFamilyEmail(e.target.value)}
                        placeholder="familiar@email.com"
                        className="w-full bg-input border border-border text-foreground rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Permisos</label>
                      <select
                        value={permissions}
                        onChange={(e) => setPermissions(e.target.value)}
                        className="w-full bg-input border border-border text-foreground rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      >
                        <option value="view">Solo ver</option>
                        <option value="comment">Ver y comentar</option>
                        <option value="edit">Ver y editar</option>
                        <option value="share">Control total</option>
                      </select>
                    </div>

                    <Button
                      onClick={handleShareInvite}
                      disabled={!familyEmail}
                      className="w-full font-semibold"
                    >
                      Enviar Invitación
                    </Button>

                    <div className="bg-muted/30 border border-border rounded-xl p-4 mt-6">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-primary" />
                        Miembros actuales
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Aún no has compartido tu bóveda con nadie.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
