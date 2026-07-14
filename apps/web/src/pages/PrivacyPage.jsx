
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Política de Privacidad - MemorIAmobile</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full prose prose-slate">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Política de Privacidad</h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-foreground/80">
          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">1. Nuestro compromiso con tu privacidad</h2>
          <p>
            En MemorIAmobile, sabemos que tus recuerdos son la información más valiosa y personal que posees. 
            Nuestra principal prioridad es proteger tus datos. No vendemos tus datos a terceros ni los utilizamos para entrenar modelos de IA de otras compañías.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">2. Datos que recopilamos</h2>
          <p>Para proveer nuestro servicio de bóveda inteligente, recopilamos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Información de la cuenta:</strong> Nombre, dirección de correo electrónico y contraseña (cifrada).</li>
            <li><strong>Tus archivos:</strong> Fotos, vídeos, documentos y notas de voz que decides respaldar.</li>
            <li><strong>Metadatos:</strong> Fecha de subida, tamaño del archivo y tipo de dispositivo.</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">3. Cómo utilizamos la Inteligencia Artificial</h2>
          <p>
            Los procesos de IA de MemorIAmobile (como reconocimiento de rostros, etiquetado de lugares y transcripción) 
            se ejecutan en entornos aislados y cifrados. Esta información solo se usa para habilitar la búsqueda inteligente 
            en <em>tu propia cuenta</em>. No compartimos tus etiquetas con otros usuarios.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">4. Seguridad y Cifrado</h2>
          <p>
            Tus archivos se almacenan utilizando encriptación avanzada AES-256 de extremo a extremo en reposo y TLS en tránsito.
            Solo tú posees las claves de acceso a través de tus credenciales.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">5. Tus derechos</h2>
          <p>Tienes el derecho absoluto de:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder y descargar todos tus datos en cualquier momento.</li>
            <li>Eliminar tu cuenta de forma permanente, lo que destruirá todos tus archivos de nuestros servidores.</li>
            <li>Modificar o actualizar tu información personal.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
