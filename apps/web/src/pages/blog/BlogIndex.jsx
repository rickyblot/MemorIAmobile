import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Image as ImageIcon, Newspaper } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import {
  formatBlogDate,
  getPublishedMockBlogPosts,
} from '@/data/mockBlogPosts.js';

export default function BlogIndex() {
  const posts = useMemo(() => getPublishedMockBlogPosts(), []);

  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col">
      <Helmet>
        <title>Blog / Noticias - MemorIAmobile</title>
        <meta
          name="description"
          content="Novedades, guías y actualizaciones de MemorIAmobile."
        />
      </Helmet>

      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center text-primary mx-auto mb-5 shadow-sm border border-border">
              <Newspaper className="w-7 h-7" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary font-heading tracking-tight mb-4">
              Blog / Noticias
            </h1>
            <p className="text-lg text-muted-foreground">
              Actualizaciones, consejos y novedades de la plataforma.
            </p>
          </motion.div>

          {posts.length === 0 ? (
            <div className="bg-card rounded-3xl border border-border shadow-sm py-20 px-6 text-center">
              <p className="text-muted-foreground text-lg">
                Pronto publicaremos las primeras novedades.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <time dateTime={post.created}>{formatBlogDate(post.created)}</time>
                      </div>

                      <h2 className="text-xl font-bold text-foreground font-heading leading-snug mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
                        {post.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        Leer más
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
