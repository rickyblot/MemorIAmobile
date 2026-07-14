const en = {
  common: {
    home: 'Home', features: 'Features', howItWorks: 'How It Works', testimonials: 'Testimonials', pricing: 'Pricing', faq: 'FAQ',
    signIn: 'Sign In', signUp: 'Sign Up', logout: 'Logout', manage: 'Manage', back: 'Back', save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete',
    loading: 'Loading...', success: 'Success', error: 'Error', confirm: 'Confirm',
    free: 'Free', monthShort: '/mo', mostPopular: 'Most Popular', subscribe: 'Subscribe'
  },
  landing: {
    hero: { title: 'Preserve Your Memories with AI-Powered Stories', subtitle: 'Transform your photos and videos into beautiful, personalized narratives', cta1: 'Start Creating Stories Now', cta2: 'Learn How It Works' },
    features: { title: 'Powerful Features', subtitle: 'Everything you need to preserve your legacy', f1: { title: 'Upload Media', desc: 'Securely store your photos and videos.' }, f2: { title: 'AI Story Generation', desc: 'Transform images into written narratives.' }, f3: { title: 'Video Slideshows', desc: 'Create beautiful automated presentations.' }, f4: { title: 'Secure Sharing', desc: 'Share safely with family members.' } },
    howItWorks: { title: 'How It Works', step1: { title: 'Upload', desc: 'Add your photos and videos securely.' }, step2: { title: 'Analyze', desc: 'Our AI processes visual details.' }, step3: { title: 'Generate', desc: 'A narrative is automatically woven.' }, step4: { title: 'Share', desc: 'Distribute with loved ones.' } },
    testimonials: { title: 'What Our Users Say', t1: { text: "This app brought my old family photos to life.", author: "Maya Chen" }, t2: { text: "The AI stories capture the exact emotion of our vacations.", author: "Raj Patel" }, t3: { text: "A beautiful way to leave a legacy for my grandchildren.", author: "Lucia Torres" } },
    pricing: { title: 'Simple Pricing', subtitle: 'Choose the best plan for your memories', free: { title: 'Free', price: '$0', f1: '5GB Storage', f2: 'Basic AI Stories', f3: 'Web Access' }, pro: { title: 'Pro', price: '$9', f1: '100GB Storage', f2: 'Advanced AI & Videos', f3: 'Priority Support' }, max: { title: 'Max', price: '$19', f1: 'Unlimited Storage', f2: 'All Premium Features', f3: 'Family Sharing' } },
    faq: { title: 'Frequently Asked Questions', q1: { q: 'Is my data secure?', a: 'Yes, we use end-to-end encryption.' }, q2: { q: 'Can I cancel anytime?', a: 'Absolutely, no lock-in contracts.' }, q3: { q: 'How does the AI work?', a: 'It analyzes image contents to craft contextual stories.' }, q4: { q: 'Can I share stories?', a: 'Yes, via secure private links.' }, q5: { q: 'Is there a limit on photos?', a: 'Limits depend on your subscription tier.' } },
    cta: { title: 'Ready to start your journey?', subtitle: 'Join thousands preserving their legacy today.', button: 'Sign Up for Free' }
  },
  auth: {
    login: { title: 'Welcome Back', subtitle: 'Sign in to your account', email: 'Email', password: 'Password', forgot: 'Forgot password?', submit: 'Sign In', noAccount: 'No account?', signup: 'Sign up' },
    signup: { title: 'Create Account', subtitle: 'Start preserving your memories', name: 'Name', email: 'Email', password: 'Password', confirm: 'Confirm Password', submit: 'Sign Up', hasAccount: 'Already have an account?', login: 'Sign in' },
    reset: { title: 'Reset Password', subtitle: 'Enter your email', email: 'Email', submit: 'Send Link', back: 'Back to Login', success: 'Check your email for the reset link.' },
    newPwd: { title: 'New Password', subtitle: 'Enter your new password', pwd: 'New Password', confirm: 'Confirm Password', submit: 'Reset Password', success: 'Password updated successfully.' }
  },
  dashboard: { title: 'Dashboard', welcome: 'Welcome back', stats: { memories: 'Memories', stories: 'Stories', family: 'Family' }, quickAccess: 'Quick Access', recent: 'Recent Memories', viewAll: 'View All' },
  gallery: { title: 'Media Gallery', subtitle: 'Your photos and videos', upload: 'Upload Media', filterAll: 'All', filterPhotos: 'Photos', filterVideos: 'Videos', empty: 'No media found. Upload to start.' },
  stories: { title: 'Stories', subtitle: 'Your AI generated narratives', create: 'Create Story', empty: 'No stories yet. Generate one from your memories.', generated: 'AI Generated', print: 'Print', export: 'Export', return: 'Back to Stories', visuals: 'Visual Inspiration' },
  memories: { title: 'Memory Vault', subtitle: 'Your archive', uploadTitle: 'Add Memory', uploadDesc: 'Upload a new photo or video', searchTitle: 'AI Search', talk: 'Talk to your archive', noMatches: 'No matches found.' },
  timeline: { title: 'Life Timeline', subtitle: 'Your chronological journey', filter: 'Filter', empty: 'No events found.' },
  profile: { title: 'Profile Settings', subtitle: 'Manage your account', name: 'Full Name', email: 'Email', save: 'Save Changes', updated: 'Profile updated' },
  security: { title: 'Security & Privacy', subtitle: 'Your data is protected', e2e: 'End-to-end Encryption', privacy: 'Privacy First', changePwd: 'Change Password', enable2fa: 'Enable 2FA' },
  family: { title: 'Family Sharing', subtitle: 'Share with loved ones', invite: 'Invite Member', role: 'Role', remove: 'Remove' },
  messages: { errorSave: 'Failed to save', errorLoad: 'Failed to load', successSave: 'Saved successfully', confirmDelete: 'Are you sure you want to delete this?' },
  plansPage: {
    list: {
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save',
      currentPlan: 'Current plan',
      viewFeatures: 'View features',
      startFree: 'Start free',
      choose: 'Choose',
      space: ' ',
      free: {
        desc: 'Get started with essential memory storage at no cost.',
        features: {
          0: '1 GB secure storage',
          1: 'Basic photo uploads',
          2: 'Web access',
          3: 'Email support',
        },
      },
      basico: {
        saveText: 'Save with annual billing',
        features: {
          0: '10 GB secure storage',
          1: 'Automatic organization',
          2: 'Basic search',
          3: 'Cloud backup',
        },
      },
      pro: {
        badge: 'Most popular',
        saveText: 'Save with annual billing',
        features: {
          0: '100 GB secure storage',
          1: 'AI story generation',
          2: 'Smart search',
          3: 'PDF export',
        },
      },
      premium: {
        badge: 'Recommended',
        saveText: 'Save with annual billing',
        features: {
          0: 'Unlimited storage',
          1: 'Advanced AI features',
          2: 'Family sharing',
          3: 'Priority support',
        },
      },
    },
  },
  comparisonTable: {
    features: 'Features',
    free: 'Free',
    basico: 'Basic',
    pro: 'Pro',
    premium: 'Premium',
    priceFree: '€0',
    priceBasico: '€4.99',
    pricePro: '€9.99',
    pricePremium: '€19.99',
    rows: {
      0: { name: 'Secure storage', free: '1 GB', basico: '10 GB', pro: '100 GB', premium: 'Unlimited' },
      1: { name: 'Photo & video upload', free: 'true', basico: 'true', pro: 'true', premium: 'true' },
      2: { name: 'AI stories', free: 'false', basico: 'false', pro: 'true', premium: 'true' },
      3: { name: 'Smart search', free: 'false', basico: 'Basic', pro: 'Advanced', premium: 'Advanced' },
      4: { name: 'Family sharing', free: 'false', basico: 'false', pro: 'false', premium: 'true' },
      5: { name: 'Export (PDF / video)', free: 'false', basico: 'false', pro: 'true', premium: 'true' },
      6: { name: 'Priority support', free: 'false', basico: 'false', pro: 'false', premium: 'true' },
    },
  },
  subs: {
    updating: 'Updating your subscription...',
    changePortal: 'Change plan in the billing portal',
    viewPlans: 'View plans',
    testModeError: 'Test subscriptions cannot be managed. Use a real payment method to enable full access.',
    redirecting: 'Redirecting...',
    manage: 'Manage subscription',
    activating: 'Activating your subscription...',
    holdOn: 'Hold on while we finalize your payment. This usually takes a few seconds.',
    almostThere: 'Almost there',
    processing: 'Your payment is being processed. Refresh in a moment to see your subscription.',
    noSubTitle: 'Subscription',
    noSubDesc: "You don't have an active subscription. Unlock premium features with a paid plan.",
    trialing: 'Trialing',
    active: 'Active',
    checkoutError: 'Checkout failed. Please try again or contact support.',
    subscribeTo: 'Subscribe to {plan}',
  },
};

const buildLang = (base, overrides) => {
  const result = JSON.parse(JSON.stringify(base));
  for (const k in overrides) {
    if (typeof overrides[k] === 'object' && !Array.isArray(overrides[k])) {
      result[k] = { ...result[k], ...overrides[k] };
    } else {
      result[k] = overrides[k];
    }
  }
  return result;
};

export const translations = {
  en,
  es: buildLang(en, {
    common: { home: 'Inicio', features: 'Funciones', howItWorks: 'Cómo Funciona', testimonials: 'Testimonios', pricing: 'Precios', faq: 'Preguntas Frecuentes', signIn: 'Iniciar Sesión', signUp: 'Registrarse', logout: 'Cerrar Sesión', manage: 'Gestionar', back: 'Volver', save: 'Guardar', cancel: 'Cancelar', edit: 'Editar', delete: 'Eliminar', loading: 'Cargando...', success: 'Éxito', error: 'Error', confirm: 'Confirmar', free: 'Gratis', monthShort: '/mes', mostPopular: 'Más popular', subscribe: 'Suscribirse' },
    landing: {
      hero: { title: 'Preserva tus recuerdos con IA', subtitle: 'Transforma tus fotos y videos en hermosas narrativas personaladas', cta1: 'Comienza a crear historias', cta2: 'Descubre cómo funciona' },
      features: { title: 'Funciones Poderosas', subtitle: 'Todo lo que necesitas para preservar tu legado', f1: { title: 'Subir Medios', desc: 'Almacena tus fotos y videos.' }, f2: { title: 'Historias IA', desc: 'Transforma imágenes en narrativas.' }, f3: { title: 'Presentaciones', desc: 'Crea videos automatizados.' }, f4: { title: 'Compartir Seguro', desc: 'Comparte con tu familia.' } },
      howItWorks: { title: 'Cómo Funciona', step1: { title: 'Subir', desc: 'Añade fotos y videos de forma segura.' }, step2: { title: 'Analizar', desc: 'Nuestra IA procesa los detalles.' }, step3: { title: 'Generar', desc: 'Se crea una narrativa automáticamente.' }, step4: { title: 'Compartir', desc: 'Comparte con tus seres queridos.' } },
      testimonials: { title: 'Lo que dicen nuestros usuarios', t1: { text: "Esta app dio vida a mis fotos familiares.", author: "Maya Chen" }, t2: { text: "Las historias capturan la emoción exacta.", author: "Raj Patel" }, t3: { text: "Un hermoso legado para mis nietos.", author: "Lucia Torres" } },
      pricing: { title: 'Precios Simples', subtitle: 'Elige el mejor plan para tus recuerdos', free: { title: 'Gratis', price: '$0', f1: '5GB Almacenamiento', f2: 'Historias IA Básicas', f3: 'Acceso Web' }, pro: { title: 'Pro', price: '$9', f1: '100GB Almacenamiento', f2: 'Historias IA Avanzadas', f3: 'Soporte Prioritario' }, max: { title: 'Max', price: '$19', f1: 'Almacenamiento Ilimitado', f2: 'Funciones Premium', f3: 'Compartir en Familia' } },
      faq: { title: 'Preguntas Frecuentes', q1: { q: '¿Están seguros mis datos?', a: 'Sí, usamos encriptación de extremo a extremo.' }, q2: { q: '¿Puedo cancelar?', a: 'Absolutamente, sin contratos fijos.' }, q3: { q: '¿Cómo funciona la IA?', a: 'Analiza las imágenes para crear historias.' }, q4: { q: '¿Puedo compartir historias?', a: 'Sí, mediante enlaces privados.' }, q5: { q: '¿Hay límite de fotos?', a: 'Depende de tu plan de suscripción.' } },
      cta: { title: '¿Listo para empezar?', subtitle: 'Únete a miles que preservan su legado.', button: 'Regístrate Gratis' }
    },
    auth: {
      login: { title: 'Bienvenido de nuevo', subtitle: 'Inicia sesión', email: 'Correo', password: 'Contraseña', forgot: '¿Olvidaste tu contraseña?', submit: 'Entrar', noAccount: '¿No tienes cuenta?', signup: 'Regístrate' },
      signup: { title: 'Crear Cuenta', subtitle: 'Empieza a preservar tus recuerdos', name: 'Nombre', email: 'Correo', password: 'Contraseña', confirm: 'Confirmar Contraseña', submit: 'Registrarse', hasAccount: '¿Ya tienes cuenta?', login: 'Entrar' },
      reset: { title: 'Restablecer Contraseña', subtitle: 'Ingresa tu correo', email: 'Correo', submit: 'Enviar Enlace', back: 'Volver', success: 'Revisa tu correo para el enlace.' },
      newPwd: { title: 'Nueva Contraseña', subtitle: 'Ingresa tu nueva contraseña', pwd: 'Nueva Contraseña', confirm: 'Confirmar Contraseña', submit: 'Restablecer', success: 'Contraseña actualizada.' }
    },
    dashboard: { title: 'Panel', welcome: 'Bienvenido', stats: { memories: 'Recuerdos', stories: 'Historias', family: 'Familia' }, quickAccess: 'Acceso Rápido', recent: 'Recuerdos Recientes', viewAll: 'Ver Todo' },
    gallery: { title: 'Galería', subtitle: 'Tus fotos y videos', upload: 'Subir Medios', filterAll: 'Todo', filterPhotos: 'Fotos', filterVideos: 'Videos', empty: 'No hay medios. Sube para empezar.' },
    stories: { title: 'Historias', subtitle: 'Tus narrativas generadas por IA', create: 'Crear Historia', empty: 'No hay historias. Genera una.', generated: 'Generada por IA', print: 'Imprimir', export: 'Exportar', return: 'Volver a Historias', visuals: 'Inspiración Visual' },
    memories: { title: 'Bóveda de Recuerdos', subtitle: 'Tu archivo', uploadTitle: 'Añadir Recuerdo', uploadDesc: 'Sube una foto o video', searchTitle: 'Búsqueda IA', talk: 'Habla con tu archivo', noMatches: 'No se encontraron coincidencias.' },
    timeline: { title: 'Línea de Tiempo', subtitle: 'Tu viaje cronológico', filter: 'Filtrar', empty: 'No hay eventos.' },
    profile: { title: 'Perfil', subtitle: 'Gestiona tu cuenta', name: 'Nombre Completo', email: 'Correo', save: 'Guardar Cambios', updated: 'Perfil actualizado' },
    security: { title: 'Seguridad y Privacidad', subtitle: 'Tus datos están protegidos', e2e: 'Encriptación', privacy: 'Privacidad Primero', changePwd: 'Cambiar Contraseña', enable2fa: 'Habilitar 2FA' },
    family: { title: 'Compartir en Familia', subtitle: 'Comparte con tus seres queridos', invite: 'Invitar Miembro', role: 'Rol', remove: 'Eliminar' },
    messages: { errorSave: 'Error al guardar', errorLoad: 'Error al cargar', successSave: 'Guardado con éxito', confirmDelete: '¿Estás seguro de que deseas eliminar esto?' },
    plansPage: {
      list: {
        monthly: 'Mensual',
        yearly: 'Anual',
        save: 'Ahorra',
        currentPlan: 'Plan actual',
        viewFeatures: 'Ver funciones',
        startFree: 'Empezar gratis',
        choose: 'Elegir',
        space: ' ',
        free: {
          desc: 'Empieza con almacenamiento esencial sin coste.',
          features: {
            0: '1 GB de almacenamiento seguro',
            1: 'Subida básica de fotos',
            2: 'Acceso web',
            3: 'Soporte por correo',
          },
        },
        basico: {
          saveText: 'Ahorra con facturación anual',
          features: {
            0: '10 GB de almacenamiento seguro',
            1: 'Organización automática',
            2: 'Búsqueda básica',
            3: 'Copia de seguridad en la nube',
          },
        },
        pro: {
          badge: 'Más popular',
          saveText: 'Ahorra con facturación anual',
          features: {
            0: '100 GB de almacenamiento seguro',
            1: 'Historias con IA',
            2: 'Búsqueda inteligente',
            3: 'Exportación PDF',
          },
        },
        premium: {
          badge: 'Recomendado',
          saveText: 'Ahorra con facturación anual',
          features: {
            0: 'Almacenamiento ilimitado',
            1: 'Funciones IA avanzadas',
            2: 'Compartir en familia',
            3: 'Soporte prioritario',
          },
        },
      },
    },
    comparisonTable: {
      features: 'Funciones',
      free: 'Gratis',
      basico: 'Básico',
      pro: 'Pro',
      premium: 'Premium',
      priceFree: '€0',
      priceBasico: '€4.99',
      pricePro: '€9.99',
      pricePremium: '€19.99',
      rows: {
        0: { name: 'Almacenamiento seguro', free: '1 GB', basico: '10 GB', pro: '100 GB', premium: 'Ilimitado' },
        1: { name: 'Subida de fotos y videos', free: 'true', basico: 'true', pro: 'true', premium: 'true' },
        2: { name: 'Historias con IA', free: 'false', basico: 'false', pro: 'true', premium: 'true' },
        3: { name: 'Búsqueda inteligente', free: 'false', basico: 'Básica', pro: 'Avanzada', premium: 'Avanzada' },
        4: { name: 'Compartir en familia', free: 'false', basico: 'false', pro: 'false', premium: 'true' },
        5: { name: 'Exportar (PDF / video)', free: 'false', basico: 'false', pro: 'true', premium: 'true' },
        6: { name: 'Soporte prioritario', free: 'false', basico: 'false', pro: 'false', premium: 'true' },
      },
    },
    subs: {
      updating: 'Actualizando tu suscripción...',
      changePortal: 'Cambia de plan en el portal de facturación',
      viewPlans: 'Ver planes',
      testModeError: 'Las suscripciones de prueba no se pueden gestionar. Usa un método de pago real.',
      redirecting: 'Redirigiendo...',
      manage: 'Gestionar suscripción',
      activating: 'Activando tu suscripción...',
      holdOn: 'Espera mientras finalizamos tu pago. Suele tardar unos segundos.',
      almostThere: 'Casi listo',
      processing: 'Tu pago se está procesando. Actualiza en un momento para ver tu suscripción.',
      noSubTitle: 'Suscripción',
      noSubDesc: 'No tienes una suscripción activa. Desbloquea funciones premium con un plan de pago.',
      trialing: 'En prueba',
      active: 'Activa',
      checkoutError: 'Error en el pago. Inténtalo de nuevo o contacta con soporte.',
      subscribeTo: 'Suscribirse a {plan}',
    },
  }),
  fr: buildLang(en, { common: { home: 'Accueil', features: 'Caractéristiques', howItWorks: 'Comment ça marche', pricing: 'Tarifs', signIn: 'Se connecter', signUp: 'S\'inscrire' } }),
  de: buildLang(en, { common: { home: 'Startseite', features: 'Funktionen', howItWorks: 'Wie es funktioniert', pricing: 'Preise', signIn: 'Anmelden', signUp: 'Registrieren' } }),
  pt: buildLang(en, { common: { home: 'Início', features: 'Recursos', howItWorks: 'Como Funciona', pricing: 'Preços', signIn: 'Entrar', signUp: 'Cadastrar' } }),
  it: buildLang(en, { common: { home: 'Home', features: 'Caratteristiche', howItWorks: 'Come Funziona', pricing: 'Prezzi', signIn: 'Accedi', signUp: 'Registrati' } }),
};