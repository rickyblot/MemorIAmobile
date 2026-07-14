import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import {
  formatBlogDate,
  getMockBlogPostBySlug,
} from '@/data/mockBlogPosts.js';

export default function BlogDetail() {
  const { slug } = useParams();
  const post = useMemo(() => getMockBlogPostBySlug(slug), [slug]);

  if (!post || !post.published) {
    return (
      <div className="min-h-screen bg-secondary/50 flex flex-col">
        <Helmet>
          <title>404 - Post Not Found - MemorIAmobile</title>
        </Helmet>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading mb-3">
            404 - Post Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Este artículo no existe o aún no está publicado.
          </p>
          <Button asChild className="rounded-full px-6 font-semibold">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col">
      <Helmet>
        <title>{post.title} - MemorIAmobile</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              asChild
              variant="ghost"
              className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>

            {/* Featured image — full width of article container */}
            <div className="mb-8 overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Title + date below image */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-primary font-heading tracking-tight mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <time dateTime={post.created}>{formatBlogDate(post.created)}</time>
              </div>
            </header>

            {/* Full content */}
            <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-10">
              <div className="text-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>

            <div className="mt-10 flex justify-start">
              <Button asChild variant="secondary" className="rounded-full px-6">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
