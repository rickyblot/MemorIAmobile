import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, FileText, Newspaper } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MOCK_BLOG_POSTS, formatBlogDate } from '@/data/mockBlogPosts.js';

function formatDate(isoDate) {
  return formatBlogDate(isoDate);
}

export default function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_BLOG_POSTS);

  const handleDelete = (post) => {
    const confirmed = window.confirm(
      `¿Eliminar el artículo "${post.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setPosts((prev) => prev.filter((item) => item.id !== post.id));
    toast.success('Artículo eliminado', {
      description: `"${post.title}" se eliminó de la lista (datos de prueba).`,
    });
  };

  const handleEdit = (post) => {
    navigate(`/admin/blog/${post.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/blog/new');
  };

  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col">
      <Helmet>
        <title>Admin · Blog - MemorIAmobile</title>
        <meta name="description" content="Administra las publicaciones del blog y noticias." />
      </Helmet>

      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-border">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading tracking-tight">
                  Blog / Noticias
                </h1>
                <p className="text-muted-foreground mt-1">
                  Publica y administra actualizaciones de la plataforma.
                </p>
              </div>
            </div>

            <Button
              onClick={handleCreate}
              className="rounded-full px-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              asChild={false}
            >
              <Plus className="w-4 h-4" />
              Crear nuevo artículo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
          >
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No hay artículos</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Crea tu primera publicación para compartir novedades con tus usuarios.
                </p>
                <Button onClick={handleCreate} className="rounded-full px-6 font-semibold">
                  <Plus className="w-4 h-4" />
                  Crear nuevo artículo
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop / tablet table */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="px-6 py-4 text-foreground font-semibold">Título</TableHead>
                        <TableHead className="px-4 py-4 text-foreground font-semibold">Estado</TableHead>
                        <TableHead className="px-4 py-4 text-foreground font-semibold">Fecha</TableHead>
                        <TableHead className="px-6 py-4 text-right text-foreground font-semibold">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow
                          key={post.id}
                          className="border-border hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{post.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                /{post.slug}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            {post.published ? (
                              <Badge className="border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                Publicado
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted">
                                Borrador
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                            {formatDate(post.created)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-foreground hover:text-accent"
                                onClick={() => handleEdit(post)}
                                aria-label={`Editar ${post.title}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(post)}
                                aria-label={`Eliminar ${post.title}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-border">
                  {posts.map((post) => (
                    <div key={post.id} className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground leading-snug">{post.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">/{post.slug}</p>
                        </div>
                        {post.published ? (
                          <Badge className="shrink-0 border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            Publicado
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="shrink-0 bg-muted text-muted-foreground hover:bg-muted"
                          >
                            Borrador
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{formatDate(post.created)}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}
                            aria-label={`Editar ${post.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(post)}
                            aria-label={`Eliminar ${post.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <p className="mt-4 text-xs text-muted-foreground text-center sm:text-left">
            Datos de prueba. La conexión a PocketBase se añadirá más adelante.{' '}
            <Link to="/dashboard" className="text-accent hover:underline">
              Volver al dashboard
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
