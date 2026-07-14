
import React, { useState, useEffect } from 'react';
import { FileText, Film, Image as ImageIcon, Trash2, Eye, Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function MediaGalleryComponent({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadFiles();
  }, [currentUser, refreshTrigger]);

  const loadFiles = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const records = await pb.collection('files').getList(1, 50, {
        filter: `userId="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false,
      });
      setFiles(records.items);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Error al cargar archivos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await pb.collection('files').delete(fileId, { $autoCancel: false });
      setFiles(files.filter(f => f.id !== fileId));
      setDeleteConfirm(null);
      toast.success('Archivo eliminado');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error al eliminar archivo');
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FileText className="w-8 h-8 text-muted-foreground" />;
    
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-primary" />;
    } else if (fileType.startsWith('video/')) {
      return <Film className="w-8 h-8 text-secondary" />;
    } else {
      return <FileText className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const getFileUrl = (file) => {
    return pb.files.getUrl(file, file.file);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">No hay archivos aún</h3>
        <p className="text-muted-foreground">Sube tu primera foto, video o documento para empezar.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {files.map((file) => {
          const isImage = file.fileType?.startsWith('image/');
          const isVideo = file.fileType?.startsWith('video/');
          const fileUrl = getFileUrl(file);

          return (
            <div
              key={file.id}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-smooth cursor-pointer"
            >
              <div
                onClick={() => (isImage || isVideo) && setPreviewFile(file)}
                className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden"
              >
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    {getFileIcon(file.fileType)}
                    <span className="text-xs text-muted-foreground font-medium px-2 text-center truncate max-w-full">
                      {file.filename}
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {(isImage || isVideo) && (
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(file);
                    }}
                    className="w-10 h-10 bg-destructive/80 hover:bg-destructive rounded-full flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-1">
                <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>{formatDate(file.created)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{previewFile.filename}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-auto">
              {previewFile.fileType?.startsWith('image/') && (
                <img
                  src={getFileUrl(previewFile)}
                  alt={previewFile.filename}
                  className="w-full h-auto rounded-lg"
                />
              )}
              {previewFile.fileType?.startsWith('video/') && (
                <video
                  src={getFileUrl(previewFile)}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewFile(null)}>
                Cerrar
              </Button>
              <Button asChild>
                <a href={getFileUrl(previewFile)} download={previewFile.filename}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar archivo?</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              ¿Estás seguro de que quieres eliminar <strong>{deleteConfirm.filename}</strong>? Esta acción no se puede deshacer.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm.id)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
