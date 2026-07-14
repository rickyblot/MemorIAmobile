import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { slugifyTitle } from '@/data/mockBlogPosts.js';

export default function BlogCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [published, setPublished] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugifyTitle(value));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'El título es obligatorio.';
    if (!content.trim()) nextErrors.content = 'El contenido es obligatorio.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Revisa el formulario', {
        description: 'Título y contenido son obligatorios.',
      });
      return;
    }

    setSaving(true);

    const newPost = {
      id: String(Date.now()),
      title: title.trim(),
      slug: slug.trim() || slugifyTitle(title),
      content: content.trim(),
      excerpt: excerpt.trim(),
      image: image.trim(),
      published,
      created: new Date().toISOString(),
    };

    console.log('Created blog post:', newPost);
    toast.success('Artículo creado', {
      description: 'Se registró en consola (mock). PocketBase se conectará más adelante.',
    });
    setSaving(false);
    navigate('/admin/blog');
  };

  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col">
      <Helmet>
        <title>Crear artículo - MemorIAmobile</title>
        <meta name="description" content="Crea una nueva publicación del blog." />
      </Helmet>

      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              asChild
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <Link to="/admin/blog">
                <ArrowLeft className="w-4 h-4" />
                Volver al listado
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-border">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading tracking-tight">
                    Crear artículo
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Publica una novedad o guarda un borrador.
                  </p>
                </div>
              </div>

              {published ? (
                <Badge className="self-start border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  Publicado
                </Badge>
              ) : (
                <Badge variant="secondary" className="self-start bg-muted text-muted-foreground hover:bg-muted">
                  Borrador
                </Badge>
              )}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título del artículo"
                className="bg-background"
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-foreground">
                Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="url-amigable"
                className="bg-background font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">URL pública: /blog/{slug || '...'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-foreground">
                Extracto
              </Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Resumen corto para listados y SEO"
                className="bg-background min-h-[90px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
                Contenido <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe el contenido completo del artículo..."
                className="bg-background min-h-[220px]"
                aria-invalid={Boolean(errors.content)}
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Imagen (URL)
              </Label>
              <Input
                id="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://ejemplo.com/portada.jpg"
                className="bg-background"
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 px-4 py-4">
              <div>
                <p className="font-medium text-foreground">Publicado</p>
                <p className="text-sm text-muted-foreground">
                  {published
                    ? 'Visible en el blog público.'
                    : 'Guardado como borrador (no visible).'}
                </p>
              </div>
              <Switch
                checked={published}
                onCheckedChange={setPublished}
                aria-label="Alternar publicado"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full px-6"
                onClick={() => navigate('/admin/blog')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full px-6 font-semibold"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Crear artículo'}
              </Button>
            </div>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
