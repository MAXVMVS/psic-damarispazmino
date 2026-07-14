import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Calendar, 
  MapPin, 
  Video, 
  Award, 
  Clock, 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  Mail, 
  Instagram, 
  ChevronDown, 
  Sparkles, 
  X, 
  Heart,
  Brain,
  ShieldCheck,
  CalendarCheck,
  Palette,
  Facebook
} from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

/* --- CUSTOM SPECIFIC PSYCHOLOGY LOGO COMPONENT --- */
function PsychologyLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`logo-icon-container ${className}`}>
      <img 
        src="/assets/logo_web_header.png" 
        alt="Psic. Damaris Pazmiño Logo" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
      />
    </div>
  );
}

export default function App() {
  /* --- WHATSAPP CONFIG --- */
  const whatsappNum = import.meta.env.VITE_WHATSAPP_NUMBER || "593983186044";
  const formattedWhatsapp = whatsappNum.startsWith("593") && whatsappNum.length === 12
    ? `+593 ${whatsappNum.slice(3, 5)} ${whatsappNum.slice(5, 8)} ${whatsappNum.slice(8)}`
    : (whatsappNum.startsWith("09") && whatsappNum.length === 10
      ? `+593 ${whatsappNum.slice(1, 3)} ${whatsappNum.slice(3, 6)} ${whatsappNum.slice(6)}`
      : whatsappNum);

  /* --- STATE MANAGEMENT --- */
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* Contact Form state removed */

  /* Booking system state */
  const [selectedService, setSelectedService] = useState<{title: string, price: string, type: string} | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  /* Toast success state */
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string} | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  /* --- EFFECTS --- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Section tracker
      const sections = ['inicio', 'refugio', 'servicios', 'faq', 'contacto'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4500);
  };

  /* --- HANDLERS --- */
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const openBookingModal = (serviceName: string, price: string, type: string) => {
    setSelectedService({ title: serviceName, price, type });
  };

  const handleFloatingWhatsappClick = () => {
    const text = "Hola Psic. Damaris Pazmiño, me gustaría recibir información sobre sus consultas y servicios de psicología.";
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
    const serviceText = selectedService ? `${selectedService.title} (${selectedService.price})` : "Consulta General";

    // 0. Envío a Firebase Firestore
    const bookingData = {
      nombre: bookingName,
      email: bookingEmail,
      telefono: bookingPhone,
      servicio: serviceText,
      fecha: bookingDate,
      hora: bookingTime,
      tipo: 'Solicitud de Pre-Reserva',
      createdAt: new Date().toISOString()
    };

    addDoc(collection(db, "bookings"), bookingData)
      .then((docRef) => console.log("Pre-reserva guardada en Firestore con ID:", docRef.id))
      .catch((err) => console.error("Error al guardar en Firestore:", err));

    // 1. Envío a Formspree en segundo plano
    if (formspreeId) {
      fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: bookingName,
          email: bookingEmail,
          telefono: bookingPhone,
          servicio: serviceText,
          fecha: bookingDate,
          hora: bookingTime,
          tipo: 'Solicitud de Pre-Reserva'
        })
      }).catch(err => console.error("Error al enviar a Formspree:", err));
    }

    // 2. Redirección a WhatsApp
    const message = `Hola Psic. Damaris, me gustaría realizar una pre-reserva de consulta:
- *Nombre:* ${bookingName}
- *Correo:* ${bookingEmail}
- *Teléfono:* ${bookingPhone}
- *Servicio:* ${serviceText}
- *Fecha sugerida:* ${bookingDate}
- *Horario sugerido:* ${bookingTime}

Quedo atento/a a su respuesta. ¡Muchas gracias!`;

    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`, '_blank');

    triggerToast(
      "¡Solicitud de reserva recibida!",
      `Tu sesión de "${selectedService?.title}" para el día ${bookingDate} ha sido enviada vía WhatsApp.`
    );
    // Close modal & reset fields
    setSelectedService(null);
    setBookingName('');
    setBookingEmail('');
    setBookingPhone('');
    setBookingDate('');
    setBookingTime('');
  };

  return (
    <>
      {/* 1. FIXED HEADER */}
      <header id="app-header" className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <div className="logo-wrapper" onClick={() => handleScrollTo('inicio')} style={{ cursor: 'pointer' }}>
            <PsychologyLogo />
            <span className="logo-text-title">Psic. Damaris <span>Pazmiño</span></span>
          </div>

          <nav className={`navigation ${mobileMenuOpen ? 'opened' : ''}`}>
            <a 
              id="nav-refugio"
              href="#refugio" 
              className={`nav-link ${activeTab === 'refugio' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); handleScrollTo('refugio'); }}
            >
              Tu lugar seguro
            </a>
            <a 
              id="nav-servicios"
              href="#servicios" 
              className={`nav-link ${activeTab === 'servicios' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleScrollTo('servicios'); }}
            >
              Servicios & Precios
            </a>
            <a 
              id="nav-faq"
              href="#faq" 
              className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleScrollTo('faq'); }}
            >
              Preguntas Frecuentes
            </a>
            <a 
              id="nav-contacto"
              href="#contacto" 
              className={`nav-link ${activeTab === 'contacto' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleScrollTo('contacto'); }}
            >
              Contacto
            </a>
            
            <button 
              id="header-cta-btn"
              className="btn-premium" 
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
              onClick={() => openBookingModal("Asesoría General Primaria", "Variable", "Cita de Exploración")}
            >
              Agendar Sesión
            </button>
          </nav>

          <button 
            id="mobile-nav-toggle"
            className={`menu-toggle ${mobileMenuOpen ? 'opened' : ''}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menú de Navegación"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="inicio" className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div id="hero-welcome-badge" className="badge-comfort">
              <Sparkles size={14} /> Espacio Seguro Integral
            </div>
            <h1 id="hero-main-heading" className="hero-title">
              Acompañamiento psicológico profesional para tu bienestar y crecimiento.
            </h1>
            <div className="hero-description-container">
              <p id="hero-desc-lead" className="hero-paragraph-lead">
                Te ofrezco un espacio seguro de escucha y orientación basado en la Terapia Cognitivo-Conductual y la Neuropsicología. Diseñemos juntos herramientas prácticas y científicas para superar la ansiedad, el estrés y construir el bienestar que mereces.
              </p>
              <p id="hero-desc-cta" className="hero-paragraph-cta-text">
                <Heart size={18} style={{ color: 'var(--color-terracotta)' }} /> Da el primer paso hacia tu bienestar hoy.
              </p>
            </div>
            
            <div id="hero-action-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button 
                id="hero-primary-cta"
                className="btn-premium"
                onClick={() => openBookingModal("Sesión Individual de Exploración", "USD $35", "Acompañamiento básico")}
              >
                Agendar una sesión <ArrowRight size={18} />
              </button>
              <button 
                id="hero-secondary-cta"
                className="btn-secondary" 
                onClick={() => handleScrollTo('refugio')}
              >
                Conocer Enfoque
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="organic-blob-bg"></div>
            <div className="circle-decor circle-decor-1"></div>
            <div className="circle-decor circle-decor-2"></div>
            
            <div id="hero-visual-image-wrapper" className="hero-image-wrapper">
              <img src="/assets/cozy_therapy_chair.jpg" alt="Espacio de Acompañamiento" className="hero-main-img" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN TU LUGAR SEGURO (SOBRE MÍ Y ENFOQUE TCC/NEUROPSICOLÓGICO) */}
      <section id="refugio" className="refugio">
        <div className="container">
          <div className="refugio-header-container">
            <div className="section-head">
              <span id="refugio-tag" className="section-tag">Tu lugar seguro</span>
              <h2 id="refugio-title" className="section-title">Sobre mí y mi Enfoque Terapéutico</h2>
              <p id="refugio-sub" className="section-sub">Un espacio de acompañamiento cercano y especializado, donde la escucha, el conocimiento científico y el bienestar emocional se unen para apoyarte en tu proceso.</p>
            </div>
            <div className="refugio-header-visual">
              <img src="/assets/youth_therapy_office.jpg" alt="Consultorio de Acompañamiento Juvenil" className="refugio-header-img" />
            </div>
          </div>

          <div className="bento-grid">
            {/* Bento Card 1: Portrait Photo */}
            <div className="bento-card bento-photo-card">
              <img src="/assets/damaris_portrait.png" alt="Psic. Damaris Pazmiño" />
            </div>

            {/* Bento Card 2: Condensed Bio */}
            <div className="bento-card bento-bio-card">
              <span className="section-tag" style={{ fontSize: '1.05rem', marginBottom: '0.25rem', fontWeight: 700 }}>Sobre mí</span>
              <h3 className="bento-card-title" style={{ fontSize: '1.65rem' }}>Hola, soy Damaris Pazmiño</h3>
              <p className="bento-card-p" style={{ fontWeight: 500, color: 'var(--color-navy)' }}>
                Psicóloga y Neuropsicóloga Clínica, especialista en psicoterapia infanto-juvenil y adultos, y facilitadora de talleres de Arteterapia.
              </p>
              <p className="bento-card-p">
                Ofrezco un espacio seguro y profesional para comprender tus emociones, fortalecer tus recursos personales y desarrollar estrategias prácticas basadas en evidencia científica.
              </p>
              <p className="bento-card-p">
                Mi objetivo es acompañarte a superar cambios, desafíos emocionales o etapas de incertidumbre, combinando la calidez humana con el rigor científico para que afrontes la vida con mayor seguridad y confianza.
              </p>
            </div>

            {/* Bento Card 3: Therapeutic Approach */}
            <div className="bento-card bento-approach-card">
              <span className="section-tag" style={{ fontSize: '1.05rem', marginBottom: '0.25rem', fontWeight: 700 }}>Estrategias científicas</span>
              <h3 className="bento-card-title">Mi Enfoque Terapéutico</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Brain size={16} style={{ color: 'var(--color-sage)' }} /> Terapia Cognitivo-Conductual (TCC)
                  </h4>
                  <p className="bento-card-p" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
                    Identificamos patrones de pensamiento y conducta para desarrollar herramientas prácticas aplicables en tu día a día.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} style={{ color: 'var(--color-sage)' }} /> Perspectiva Neuropsicológica
                  </h4>
                  <p className="bento-card-p" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
                    Comprendemos procesos clave como la atención, memoria, aprendizaje y regulación emocional para un desarrollo integral.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={16} style={{ color: 'var(--color-sage)' }} /> Psicoeducación Activa
                  </h4>
                  <p className="bento-card-p" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
                    Comprender lo que te ocurre es el primer paso para tomar un rol activo en tu propio bienestar y crecimiento.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 4: What to Expect */}
            <div className="bento-card bento-expect-card">
              <h3 className="bento-card-title" style={{ fontSize: '1.1rem' }}>¿Qué puedes esperar del proceso?</h3>
              <ul className="expect-list" style={{ gap: '0.6rem' }}>
                <li className="expect-item" style={{ fontSize: '0.85rem' }}>
                  <span className="expect-icon-check" style={{ width: '1.1rem', height: '1.1rem' }}><Check size={10} /></span>
                  <span>Un espacio seguro, confidencial y libre de juicios.</span>
                </li>
                <li className="expect-item" style={{ fontSize: '0.85rem' }}>
                  <span className="expect-icon-check" style={{ width: '1.1rem', height: '1.1rem' }}><Check size={10} /></span>
                  <span>Atención cercana, profesional y personalizada.</span>
                </li>
                <li className="expect-item" style={{ fontSize: '0.85rem' }}>
                  <span className="expect-icon-check" style={{ width: '1.1rem', height: '1.1rem' }}><Check size={10} /></span>
                  <span>Objetivos claros adaptados a tus necesidades.</span>
                </li>
                <li className="expect-item" style={{ fontSize: '0.85rem' }}>
                  <span className="expect-icon-check" style={{ width: '1.1rem', height: '1.1rem' }}><Check size={10} /></span>
                  <span>Herramientas prácticas para aplicar en tu vida diaria.</span>
                </li>
                <li className="expect-item" style={{ fontSize: '0.85rem' }}>
                  <span className="expect-icon-check" style={{ width: '1.1rem', height: '1.1rem' }}><Check size={10} /></span>
                  <span>Acompañamiento basado en evidencia científica.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GRID DE 5 TARJETAS DE SERVICIOS Y PRECIOS (GLASSMORPHISM) */}
      <section id="servicios" className="servicios">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', margin: '0 auto 4.5rem auto' }}>
            <span id="services-tag" className="section-tag">Servicios Profesionales</span>
            <h2 id="services-title" className="section-title">Opciones de Acompañamiento</h2>
            <p id="services-sub" className="section-sub">Encuentra la modalidad idónea que más se adapte a tu estilo de vida y necesidades actuales.</p>
          </div>

          <div id="services-cards-grid" className="services-grid">
            
            {/* SERVICE CARD 1 */}
            <div id="service-card-eval-inicial" className="service-card">
              <div className="service-icon-heading">
                <Brain size={24} />
              </div>
              <h3 className="service-title">Valoración Neuropsicológica Inicial</h3>
              <p className="service-description">
                Primer encuentro para comprender el motivo de consulta, conocer antecedentes y estructurar el plan de evaluación.
              </p>
              
              <span className="service-includes-title">Incluye:</span>
              <ul className="service-features-list">
                <li className="service-feature-item">
                  <Check size={16} /> Entrevista clínica y observación.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Revisión de antecedentes.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Definición de objetivos de evaluación.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> Duración: 60 minutos
                </span>
                <span className="service-price-tag">
                  USD $60 <span className="service-price-sub">/ sesión inicial</span>
                </span>
              </div>

              <button 
                id="service-cta-eval-inicial"
                className="btn-premium service-cta-btn" 
                onClick={() => openBookingModal("Valoración Neuropsicológica Inicial", "USD $60", "Evaluación inicial")}
              >
                Reservar valoración
              </button>
            </div>

            {/* SERVICE CARD 2 (RECOMMENDED EVALUATION) */}
            <div id="service-card-eval-integral" className="service-card recommended">
              <span className="badge-recommended">Proceso Completo</span>
              <div className="service-icon-heading">
                <Brain size={24} style={{ color: 'var(--color-terracotta)' }} />
              </div>
              <h3 className="service-title">Evaluación Neuropsicológica Integral</h3>
              <p className="service-description">
                Estudio detallado del funcionamiento cognitivo, emocional y conductual para guiar una intervención personalizada.
              </p>
              
              <span className="service-includes-title">Incluye:</span>
              <ul className="service-features-list">
                <li className="service-feature-item">
                  <Check size={16} /> Pruebas de memoria y atención.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Informe clínico con pautas recomendadas.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Sesión de devolución de resultados.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> 4 a 8 sesiones (según el caso)
                </span>
                <span className="service-price-tag" style={{ color: 'var(--color-terracotta-dark)' }}>
                  Desde $150 <span className="service-price-sub">/ valor de referencia</span>
                </span>
              </div>

              <button 
                id="service-cta-eval-integral"
                className="btn-premium service-cta-btn" 
                onClick={() => openBookingModal("Evaluación Neuropsicológica Integral", "Personalizado (desde $150)", "Evaluación integral")}
              >
                Solicitar evaluación
              </button>
            </div>

            {/* SERVICE CARD 3 */}
            <div id="service-card-online" className="service-card">
              <div className="service-icon-heading">
                <Video size={24} />
              </div>
              <h3 className="service-title">Sesión Individual Online</h3>
              <p className="service-description">
                Acompañamiento terapéutico confidencial en modalidad virtual, ideal para tratar ansiedad, estrés y autoestima.
              </p>
              
              <span className="service-includes-title">Beneficios:</span>
              <ul className="service-features-list">
                <li className="service-feature-item">
                  <Check size={16} /> Flexibilidad horaria y comodidad.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Enfoque personalizado basado en evidencia.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Sesiones seguras desde cualquier lugar.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> Duración: 50 minutos
                </span>
                <span className="service-price-tag">
                  USD $25 <span className="service-price-sub">/ sesión virtual</span>
                </span>
              </div>

              <button 
                id="service-cta-online"
                className="btn-premium service-cta-btn"
                onClick={() => openBookingModal("Sesión Individual Online", "USD $25", "Cita Online")}
              >
                Agendar sesión online
              </button>
            </div>

            {/* SERVICE CARD 4 */}
            <div id="service-card-presencial" className="service-card">
              <div className="service-icon-heading">
                <MapPin size={24} />
              </div>
              <h3 className="service-title">Sesión Presencial en Guayaquil</h3>
              <p className="service-description">
                Consulta individual en un consultorio físico cálido y seguro para trabajar de manera conjunta en tus metas.
              </p>
              
              <span className="service-includes-title">Incluye:</span>
              <ul className="service-features-list">
                <li className="service-feature-item">
                  <Check size={16} /> Espacio físico cómodo y confidencial.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Sesiones personalizadas 1 a 1.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Plan de trabajo terapéutico adaptado.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> Duración: 50 minutos
                </span>
                <span className="service-price-tag">
                  USD $35 <span className="service-price-sub">/ sesión física</span>
                </span>
              </div>

              <button 
                id="service-cta-presencial"
                className="btn-premium service-cta-btn"
                onClick={() => openBookingModal("Sesión Presencial en Guayaquil", "USD $35", "Cita Física")}
              >
                Agendar sesión presencial
              </button>
            </div>

            {/* SERVICE CARD 5 */}
            <div id="service-card-arteterapia" className="service-card">
              <div className="service-icon-heading">
                <Palette size={24} />
              </div>
              <h3 className="service-title">Talleres de Arteterapia</h3>
              <p className="service-description">
                Talleres vivenciales grupales que utilizan el arte como canal terapéutico de expresión y autoconocimiento.
              </p>
              
              <span className="service-includes-title">Incluye:</span>
              <ul className="service-features-list">
                <li className="service-feature-item">
                  <Check size={16} /> Todos los materiales artísticos.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Sin necesidad de experiencia previa.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Enfoque vivencial libre de juicios.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> Duración: 3 horas
                </span>
                <span className="service-price-tag">
                  USD $35 <span className="service-price-sub">/ participante</span>
                </span>
              </div>

              <button 
                id="service-cta-arteterapia"
                className="btn-premium service-cta-btn"
                onClick={() => openBookingModal("Talleres de Arteterapia", "USD $35", "Taller Grupal")}
              >
                Reservar taller
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECCIÓN PREGUNTAS FRECUENTES (FAQ INTERACTIVO) */}
      <section id="faq" className="faq">
        <div className="container faq-layout">
          <div className="faq-title-sticky">
            <span id="faq-tag" className="section-tag">Resolviendo Dudas</span>
            <h2 id="faq-heading-main" className="section-title">Preguntas Frecuentes</h2>
            <p id="faq-sub-lead" className="section-sub" style={{ marginTop: '1rem' }}>
              Entiendo que iniciar un proceso terapéutico puede generar incertidumbre. A continuación comparto respuestas a las inquietudes más comunes.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-sage-dark)' }}>
              <Award size={20} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Miembro Avalado por Colegios Profesionales</span>
            </div>
          </div>

          <div id="faq-accordion-group" className="faq-list-container">
            {/* FAQ ITEM 1 */}
            <div className={`faq-accordion-item ${openFaq === 1 ? 'opened' : ''}`}>
              <button 
                className="faq-accordion-header" 
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
              >
                <span className="faq-accordion-question">¿Cómo sé si necesito terapia?</span>
                <div className="faq-accordion-icon-box">
                  <ChevronDown size={14} />
                </div>
              </button>
              <div className="faq-accordion-content-panel" style={{ maxHeight: openFaq === 1 ? '300px' : '0px' }}>
                <div className="faq-accordion-content-inner">
                  No es necesario estar atravesando una crisis para buscar ayuda profesional. La terapia puede ayudarte si sientes ansiedad frecuente, dificultades emocionales, problemas de autoestima, estrés constante o simplemente deseas comprenderte mejor y fortalecer tu bienestar.
                </div>
              </div>
            </div>

            {/* FAQ ITEM 2 */}
            <div className={`faq-accordion-item ${openFaq === 2 ? 'opened' : ''}`}>
              <button 
                className="faq-accordion-header" 
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
              >
                <span className="faq-accordion-question">¿Qué sucede en la primera sesión?</span>
                <div className="faq-accordion-icon-box">
                  <ChevronDown size={14} />
                </div>
              </button>
              <div className="faq-accordion-content-panel" style={{ maxHeight: openFaq === 2 ? '300px' : '0px' }}>
                <div className="faq-accordion-content-inner">
                  La primera sesión está enfocada en conocerte, comprender tu situación actual, escuchar tus preocupaciones y definir juntos los objetivos que te gustaría alcanzar. Es un espacio de conversación seguro y libre de juicios.
                </div>
              </div>
            </div>

            {/* FAQ ITEM 3 */}
            <div className={`faq-accordion-item ${openFaq === 3 ? 'opened' : ''}`}>
              <button 
                className="faq-accordion-header" 
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
              >
                <span className="faq-accordion-question">¿La terapia es confidencial?</span>
                <div className="faq-accordion-icon-box">
                  <ChevronDown size={14} />
                </div>
              </button>
              <div className="faq-accordion-content-panel" style={{ maxHeight: openFaq === 3 ? '300px' : '0px' }}>
                <div className="faq-accordion-content-inner">
                  Sí. Toda la información compartida durante el proceso terapéutico es tratada con absoluta confidencialidad, siguiendo los principios éticos y profesionales de la práctica psicológica.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT DETAILS (CENTERED AND DIRECT) */}
      <section id="contacto" className="contacto">
        <div className="container contacto-layout">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span id="contact-tag" className="section-tag">Contacto directo</span>
            <h2 id="contact-heading" className="section-title">Comienza tu Proceso</h2>
            <p id="contact-desc" className="contacto-para" style={{ marginTop: '0.75rem', maxWidth: '540px', margin: '0.75rem auto 0 auto' }}>
              Escríbeme con total tranquilidad. Estoy aquí para aclarar tus dudas y coordinar tu sesión de pre-reserva de manera directa.
            </p>
          </div>

          <div className="contact-cards-grid">
            <div 
              className="contact-direct-card" 
              onClick={handleFloatingWhatsappClick} 
              style={{ cursor: 'pointer' }}
            >
              <div className="contact-direct-icon">
                <Phone size={20} />
              </div>
              <span className="contact-direct-label">WhatsApp de Contacto</span>
              <span className="contact-direct-value">0984442648</span>
            </div>

            <div 
              className="contact-direct-card"
              onClick={() => window.open("https://instagram.com/psic.damarispazmino", "_blank")}
              style={{ cursor: 'pointer' }}
            >
              <div className="contact-direct-icon">
                <Instagram size={20} />
              </div>
              <span className="contact-direct-label">Instagram</span>
              <span className="contact-direct-value">@psic.damarispazmino</span>
            </div>

            <div 
              className="contact-direct-card"
              onClick={() => window.open("https://www.facebook.com/profile.php?id=61591817224441", "_blank")}
              style={{ cursor: 'pointer' }}
            >
              <div className="contact-direct-icon">
                <Facebook size={20} />
              </div>
              <span className="contact-direct-label">Facebook</span>
              <span className="contact-direct-value">Psic. Damaris Pazmiño</span>
            </div>

            <div 
              className="contact-direct-card"
              onClick={() => window.open("mailto:consultas@damarispazmino.com", "_blank")}
              style={{ cursor: 'pointer' }}
            >
              <div className="contact-direct-icon">
                <Mail size={20} />
              </div>
              <span className="contact-direct-label">Correo Profesional</span>
              <span className="contact-direct-value">consultas@damarispazmino.com</span>
            </div>

            <div 
              className="contact-direct-card"
              onClick={() => window.open("https://www.google.com/maps?q=Guayaquil", "_blank")}
              style={{ cursor: 'pointer' }}
            >
              <div className="contact-direct-icon">
                <MapPin size={20} />
              </div>
              <span className="contact-direct-label">Consultorio Físico</span>
              <span className="contact-direct-value">Guayaquil, Ecuador</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC REFLECTIVE SECTION (CIERRE CON CALIDEZ & SEGURIDAD) */}
      <section id="cierre-calidez" className="final-cta">
        <div className="container final-cta-inner">
          <div className="final-cta-decor">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <path d="M50,15 C50,15 25,35 25,55 C25,70 35,80 50,80 C65,80 75,70 75,55 C75,35 50,15 50,15 Z" fill="none" stroke="var(--color-terracotta)" strokeWidth="2.5" />
              <path d="M50,30 C50,30 38,44 38,55 C38,64 43,70 50,70 C57,70 62,64 62,55 C62,44 50,30 50,30 Z" fill="none" stroke="var(--color-sage)" strokeWidth="2" />
              <circle cx="50" cy="55" r="4" fill="var(--color-navy)" />
            </svg>
          </div>
          <h2 id="final-cta-title" className="final-cta-title">Tu bienestar emocional merece atención y cuidado</h2>
          <p id="final-cta-p1" className="final-cta-p">
            Pedir ayuda no significa debilidad. Significa reconocer que mereces sentirte mejor, comprenderte más profundamente y construir una vida con mayor equilibrio y tranquilidad.
          </p>
          <p id="final-cta-lead" className="final-cta-sub-lead">Estoy aquí para acompañarte en ese proceso.</p>
          <span id="final-cta-sub-text" className="final-cta-p" style={{ fontSize: '1rem', fontWeight: 500 }}>
            Agenda tu consulta y comienza a construir la versión más saludable de ti mismo.
          </span>
          <button 
            id="final-cta-btn" 
            className="btn-premium" 
            style={{ marginTop: '1.25rem', backgroundColor: 'var(--color-navy)' }}
            onClick={() => openBookingModal("Sesión Individual de Consejería", "USD $35 - $40", "Orientación general")}
          >
            Quiero agendar una sesión
          </button>
        </div>
      </section>

      {/* 8. FOOTER GENERAL */}
      <footer id="app-footer" className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src="/assets/logo_blanco.png" 
                  alt="Psic. Damaris Pazmiño Logo" 
                  style={{ height: '2.5rem', width: 'auto', objectFit: 'contain' }} 
                />
                <span id="footer-branding-title" className="footer-logo-title">Psic. Damaris <span>Pazmiño</span></span>
              </div>
              <p className="footer-desc">
                Acompañando a adolescentes y jóvenes adultos en el camino del autoconocimiento, la autovaloración constructiva y la regulación afectiva guiada por la ciencia.
              </p>
            </div>

            <div id="footer-navigation-col" className="footer-links-col">
              <span className="footer-col-title">Atajos rápidos</span>
              <ul className="footer-links-list">
                <li><a href="#inicio" className="footer-link" onClick={(e) => { e.preventDefault(); handleScrollTo('inicio'); }}>Inicio</a></li>
                <li><a href="#refugio" className="footer-link" onClick={(e) => { e.preventDefault(); handleScrollTo('refugio'); }}>Tu lugar seguro</a></li>
                <li><a href="#servicios" className="footer-link" onClick={(e) => { e.preventDefault(); handleScrollTo('servicios'); }}>Servicios</a></li>
                <li><a href="#faq" className="footer-link" onClick={(e) => { e.preventDefault(); handleScrollTo('faq'); }}>Preguntas</a></li>
                <li><a href="#contacto" className="footer-link" onClick={(e) => { e.preventDefault(); handleScrollTo('contacto'); }}>Contacto</a></li>
              </ul>
            </div>

            <div id="footer-accreditations-col" className="footer-links-col">
              <span className="footer-col-title">Acreditación e Información</span>
              <div className="footer-extra-details">
                <div className="footer-extra-item">
                  <Check size={14} /> Psicóloga Clínica Registrada (MSP)
                </div>
                <div className="footer-extra-item">
                  <Check size={14} /> Postgrado en Terapia Cognitivo-Conductual
                </div>
                <div className="footer-extra-item">
                  <Check size={14} /> Abordaje avalado por Sociedad Ecuatoriana de Neuropsicología
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Psic. Damaris Pazmiño. Todos los derechos reservados.</span>
            <span>Desarrollo por MAX AI - Digital Studio.</span>
          </div>
        </div>
      </footer>

      {/* --- FLOATING ACTION BUTTON FOR HEALING AND CALM WRITING --- */}
      <div 
        id="floating-pulsing-action-trigger" 
        className="floating-cta-trigger whatsapp-floating" 
        style={{ display: scrolled ? 'flex' : 'none' }}
        onClick={handleFloatingWhatsappClick}
        title="Chatear por WhatsApp"
      >
        <div className="pulsing-wave whatsapp-pulse"></div>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 1.981 13.93 1.95 12.01 1.95c-5.438 0-9.863 4.372-9.867 9.802-.001 1.814.48 3.593 1.393 5.168L2.51 21.062l4.137-1.908zm11.758-6.834c-.294-.147-1.743-.86-2.012-.958-.269-.098-.465-.147-.66.147-.196.294-.759.958-.93 1.154-.171.196-.343.22-.637.073-.294-.147-1.243-.458-2.37-1.464-.877-.78-1.47-1.744-1.642-2.037-.171-.294-.018-.453.129-.6.132-.132.294-.343.441-.515.147-.171.196-.294.294-.49.098-.196.049-.367-.024-.515-.074-.147-.66-1.592-.906-2.181-.24-.578-.48-.5-.66-.51-.171-.008-.367-.01-.563-.01-.196 0-.514.073-.784.367-.269.294-1.028 1.003-1.028 2.447 0 1.444 1.053 2.839 1.2 3.034.147.196 2.072 3.165 5.022 4.44.702.304 1.25.485 1.678.621.705.224 1.346.193 1.854.117.566-.083 1.743-.71 1.988-1.396.244-.686.244-1.273.171-1.396-.073-.123-.269-.196-.563-.343z"/>
        </svg>
      </div>

      {/* --- BOOKING RESERVATION GLASSMORPHISM CONTAINER (MODAL) --- */}
      <div 
        id="booking-modal-overlay" 
        className={`booking-modal-overlay ${selectedService ? 'opened' : ''}`}
        onClick={(e) => { if(e.target === e.currentTarget) setSelectedService(null); }}
      >
        <div id="booking-modal-card-element" className="booking-modal-card">
          <button id="close-booking-modal" className="booking-modal-close-btn" onClick={() => setSelectedService(null)}>
            <X size={16} />
          </button>
          
          <div className="booking-modal-header">
            <span id="booking-badge-indicator" className="section-tag" style={{ fontSize: '0.85rem', marginBottom: '0.2rem', fontWeight: 700 }}>Reserva Privada Segura</span>
            <h3 id="booking-service-title-modal" className="booking-modal-title">Pre-Agendar Sesión</h3>
            <p className="booking-modal-subtitle">
              Estás reservando: <strong style={{ color: 'var(--color-sage-dark)' }}>{selectedService?.title}</strong> ({selectedService?.price})
            </p>
          </div>

          <div id="booking-modal-content-area" className="booking-modal-body">
            <form id="booking-reservation-wizard-form" className="contact-form" onSubmit={handleBookingSubmit}>
              <div className="form-field-group">
                <label className="form-label" htmlFor="book-name">Tu nombre completo *</label>
                <input 
                  type="text" 
                  id="book-name" 
                  className="form-input-control" 
                  placeholder="Ej. Sofía Mendoza" 
                  required 
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                />
              </div>

              <div className="form-group-double">
                <div className="form-field-group">
                  <label className="form-label" htmlFor="book-email">Tu correo electrónico *</label>
                  <input 
                    type="email" 
                    id="book-email" 
                    className="form-input-control" 
                    placeholder="ejemplo@correo.com" 
                    required 
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label" htmlFor="book-phone">Teléfono / WhatsApp *</label>
                  <input 
                    type="tel" 
                    id="book-phone" 
                    className="form-input-control" 
                    placeholder="Ej. +593 99 999 9999" 
                    required 
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group-double">
                <div className="form-field-group">
                  <label className="form-label" htmlFor="book-date">Fecha tentativa *</label>
                  <input 
                    type="date" 
                    id="book-date" 
                    className="form-input-control" 
                    required 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label" htmlFor="book-time">Hora sugerida *</label>
                  <select 
                    id="book-time" 
                    className="form-input-control form-select-control" 
                    required 
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="">Selecciona horario</option>
                    <option value="09:00 - 10:00">09:00 AM - 10:00 AM</option>
                    <option value="10:00 - 11:00">10:00 AM - 11:00 AM</option>
                    <option value="11:00 - 12:00">11:00 AM - 12:00 PM</option>
                    <option value="15:00 - 16:00">03:00 PM - 04:00 PM</option>
                    <option value="16:00 - 17:00">04:00 PM - 05:00 PM</option>
                    <option value="17:00 - 18:00">05:00 PM - 06:00 PM</option>
                    <option value="18:00 - 19:00">06:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <button 
                id="booking-submit-btn" 
                type="submit" 
                className="btn-premium" 
                style={{ width: '100%', marginTop: '0.75rem', backgroundColor: 'var(--color-sage-dark)' }}
              >
                Confirmar Pre-Reserva Gratis
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-navy-light)', textAlign: 'center', display: 'block', marginTop: '0.5rem' }}>
                Tu solicitud será respondida por WhatsApp o vía telefónica dentro de las próximas 24 horas laborables.
              </span>
            </form>
          </div>
        </div>
      </div>

      {/* --- PREMIUM TOAST SUCCESS ALERT --- */}
      <div id="success-notification-alert" className={`premium-toast ${toastVisible ? 'visible' : ''}`}>
        <div className="toast-icon-box">
          <Calendar size={18} />
        </div>
        <div className="toast-content-wrapper">
          <span className="toast-title-text">{toastMessage?.title}</span>
          <span className="toast-sub-text">{toastMessage?.desc}</span>
        </div>
      </div>
    </>
  );
}
