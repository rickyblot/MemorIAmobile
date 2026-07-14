
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Loader2, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      await pb.collection('contacts').create(formData, { $autoCancel: false });
      toast.success('Mensaje enviado', {
        description: 'Nos pondremos en contacto contigo lo antes posible.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact submit error:', error);
      toast.error('Error al enviar el mensaje', {
        description: 'Por favor, inténtalo de nuevo más tarde.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col">
      <Helmet>
        <title>Contacto - MemorIAmobile</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Information Section */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">Estamos aquí para ayudarte</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Si tienes preguntas sobre nuestros planes, necesitas soporte técnico o simplemente quieres saludarnos, envíanos un mensaje.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-border">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Correo Electrónico</h3>
                  <p className="text-muted-foreground">Soporte general y técnico</p>
                  <a href="mailto:soporte@memoriamobile.com" className="text-accent hover:underline mt-1 inline-block">soporte@memoriamobile.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-border">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Chat en vivo</h3>
                  <p className="text-muted-foreground">Disponible de Lunes a Viernes, 9am - 6pm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-card p-8 rounded-3xl shadow-lg border border-border">
            <h3 className="text-2xl font-bold text-primary mb-6">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre completo</label>
                <Input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Escribe tu nombre"
                  className="bg-background text-foreground py-6 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Correo electrónico</label>
                <Input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="tu@correo.com"
                  className="bg-background text-foreground py-6 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mensaje</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="¿En qué te podemos ayudar?"
                  className="w-full flex rounded-xl border border-input bg-background px-3 py-3 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Enviar mensaje'}
              </Button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
