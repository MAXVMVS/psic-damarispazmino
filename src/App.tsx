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
  CalendarCheck
} from 'lucide-react';

/* --- CUSTOM SPECIFIC PSYCHOLOGY LOGO COMPONENT --- */
function PsychologyLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`logo-icon-container ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Overlapping soft premium circles */}
        {/* Upper-Center Sage Circle */}
        <circle cx="50" cy="38" r="23" fill="#6C8E7E" opacity="0.88" />
        {/* Left Terracotta Circle */}
        <circle cx="34" cy="52" r="21" fill="#D3846B" opacity="0.88" />
        {/* Right Navy Circle */}
        <circle cx="66" cy="52" r="21" fill="#1C2D3C" opacity="0.85" />

        {/* Organic elegant black line art overlaying (Symmetric psychology PSI-butterfly representation) */}
        {/* Central stem */}
        <path d="M50,78 Q50,60 50,56" stroke="#FAF6F0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50,78 Q50,60 50,56" stroke="#1C2D3C" strokeWidth="2.0" strokeLinecap="round" />
        
        {/* Left lower wing loop */}
        <path d="M50,58 C45,58 31,56 31,64 C31,72 44,72 50,58" stroke="#1C2D3C" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Right lower wing loop */}
        <path d="M50,58 C55,58 69,56 69,64 C69,72 56,72 50,58" stroke="#1C2D3C" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Left upper wing loop */}
        <path d="M50,56 C41,47 28,29 39,29 C49,29 50,47 50,56" stroke="#1C2D3C" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Right upper wing loop */}
        <path d="M50,56 C59,47 72,29 61,29 C51,29 50,47 50,56" stroke="#1C2D3C" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

export default function App() {
  /* --- STATE MANAGEMENT --- */
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* Contact Form state */
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactService, setContactService] = useState('Asesoría General');
  const [contactMsg, setContactMsg] = useState('');

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(
      "¡Mensaje enviado con éxito!",
      `Gracias ${contactName}, me comunicaré contigo a la brevedad posible.`
    );
    // Reset fields
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMsg('');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(
      "¡Solicitud de reserva recibida!",
      `Tu sesión de "${selectedService?.title}" para el día ${bookingDate} ha sido pre-agendada.`
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
            <span className="logo-text-title">Dra. Damaris <span>Pazmiño</span></span>
          </div>

          <nav className={`navigation ${mobileMenuOpen ? 'opened' : ''}`}>
            <a 
              id="nav-inicio"
              href="#inicio" 
              className={`nav-link ${activeTab === 'inicio' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleScrollTo('inicio'); }}
            >
              Inicio
            </a>
            <a 
              id="nav-refugio"
              href="#refugio" 
              className={`nav-link ${activeTab === 'refugio' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); handleScrollTo('refugio'); }}
            >
              El Refugio (Sobre Mí)
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
              Un espacio seguro para comprender lo que sientes y recuperar tu equilibrio emocional
            </h1>
            <div className="hero-description-container">
              <p id="hero-desc-lead" className="hero-paragraph-lead">
                A veces parece que nadie entiende lo que pasa por tu mente. La ansiedad, el estrés, la tristeza, la presión académica, los conflictos familiares o la sensación de estar perdido pueden hacer que cada día sea más difícil de lo que debería.
              </p>
              <p id="hero-desc-sub" className="hero-paragraph-sub">
                Aquí encontrarás un acompañamiento profesional, cercano y basado en evidencia científica para ayudarte a comprender tus emociones, fortalecer tu bienestar y construir herramientas que te acompañen durante toda la vida.
              </p>
              <p id="hero-desc-cta" className="hero-paragraph-cta-text">
                <Heart size={18} style={{ color: 'var(--color-terracotta)' }} /> Agenda tu primera consulta y da el primer paso hacia tu bienestar emocional.
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
            
            <div id="hero-visual-card" className="hero-glass-visual">
              <img src="/assets/therapy_abstract_bg.png" alt="Concepto Terapéutico" style={{ width: '85%', height: '85%', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
              <div id="floating-stat-box" className="hero-floating-stat">
                <div className="stat-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="stat-text">
                  <span className="stat-title">100% Confidencial</span>
                  <span className="stat-sub">Código Deontológico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN EL REFUGIO (SOBRE MÍ Y ENFOQUE TCC/NEUROPSICOLÓGICO) */}
      <section id="refugio" className="refugio">
        <div className="container">
          <div className="section-head">
            <span id="refugio-tag" className="section-tag">El Refugio</span>
            <h2 id="refugio-title" className="section-title">Sobre mí y mi Enfoque Terapéutico</h2>
            <p id="refugio-sub" className="section-sub">Un espacio diseñado para brindarte escucha activa, claridad científica y contención emocional.</p>
          </div>

          <div className="refugio-grid">
            <div className="profile-card">
              <div className="profile-sticky-outline">
                <div id="about-profile-frame" className="profile-frame">
                  <div className="profile-image-container">
                    <img src="/assets/damaris_portrait.png" alt="Dra. Damaris Pazmiño" className="profile-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="profile-meta">
                    <span id="profile-card-name" className="profile-name">Dra. Damaris Pazmiño</span>
                    <span id="profile-card-role" className="profile-subtitle">Psicóloga Clínica y Especialista Neurocognitiva</span>
                    <div className="profile-credentials-pill">
                      <div className="credential-pill">Terapia Cognitivo-Conductual</div>
                      <div className="credential-pill">Neuropsicología Aplicada</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="refugio-about">
              <div id="about-text-content" className="about-intro-block">
                <h3 id="about-greeting" style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.2rem' }}>
                  Consideraciones importantes de crecimiento
                </h3>
                <p>
                  <strong>Hola, soy Damaris Pazmiño</strong>
                </p>
                <p>
                  Psicóloga especializada en el acompañamiento de adolescentes y jóvenes adultos que desean comprender mejor sus emociones, fortalecer su autoestima y desarrollar habilidades para afrontar los desafíos de la vida cotidiana.
                </p>
                <p>
                  Sé que crecer, tomar decisiones importantes, enfrentar cambios, adaptarse a nuevas etapas o lidiar con la presión social puede generar dudas, miedo, ansiedad o sensación de agotamiento. Muchas veces se intenta manejar todo en silencio, esperando que las cosas mejoren por sí solas.
                </p>
                <p>
                  Mi objetivo es ofrecerte un espacio de escucha, respeto y confianza donde puedas sentirte comprendido, sin juicios y con la tranquilidad de saber que no tienes que enfrentar tus dificultades solo.
                </p>
                <p>
                  Juntos trabajaremos para entender lo que está ocurriendo, descubrir las causas que influyen en tu bienestar emocional y desarrollar estrategias prácticas que te permitan vivir con mayor equilibrio, claridad y seguridad.
                </p>
              </div>

              {/* ENFOQUE SECTION */}
              <div id="approach-text-box" className="enfoque-title-box">
                <span className="section-tag" style={{ fontSize: '0.75rem' }}>Estrategias científicas</span>
                <h3>Terapia basada en ciencia, adaptada a tu realidad</h3>
                <div className="enfoque-paragraph-spaced">
                  <p>
                    Mi trabajo integra la Terapia Cognitivo-Conductual (TCC) con una perspectiva neuropsicológica para ayudarte a comprender cómo tus pensamientos, emociones y hábitos influyen en tu bienestar diario.
                  </p>
                  <p>
                    En términos simples, aprenderás a identificar los patrones que mantienen el malestar emocional y a desarrollar nuevas herramientas para responder de manera más saludable a las situaciones que enfrentas.
                  </p>
                  <p>
                    La perspectiva neuropsicológica permite comprender mejor cómo funcionan procesos como la atención, la memoria, el aprendizaje, la regulación emocional y la toma de decisiones, aspectos especialmente importantes durante la adolescencia y la juventud.
                  </p>
                  <p>
                    Además, utilizo la psicoeducación como una herramienta fundamental para que entiendas lo que ocurre en tu mente y puedas participar activamente en tu proceso terapéutico.
                  </p>
                </div>

                <div className="expect-box-container">
                  <h4 className="expect-subtitle">¿Qué puedes esperar del proceso?</h4>
                  <ul className="expect-list">
                    <li className="expect-item">
                      <span className="expect-icon-check"><Check size={12} /></span>
                      <span>Un espacio seguro y confidencial.</span>
                    </li>
                    <li className="expect-item">
                      <span className="expect-icon-check"><Check size={12} /></span>
                      <span>Objetivos claros y personalizados.</span>
                    </li>
                    <li className="expect-item">
                      <span className="expect-icon-check"><Check size={12} /></span>
                      <span>Herramientas prácticas para aplicar en tu vida diaria.</span>
                    </li>
                    <li className="expect-item">
                      <span className="expect-icon-check"><Check size={12} /></span>
                      <span>Mayor autoconocimiento y regulación emocional.</span>
                    </li>
                    <li className="expect-item">
                      <span className="expect-icon-check"><Check size={12} /></span>
                      <span>Acompañamiento profesional basado en evidencia científica.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GRID DE 3 TARJETAS DE SERVICIOS Y PRECIOS (GLASSMORPHISM) */}
      <section id="servicios" className="servicios">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', margin: '0 auto 4.5rem auto' }}>
            <span id="services-tag" className="section-tag">Servicios Profesionales</span>
            <h2 id="services-title" className="section-title">Opciones de Acompañamiento</h2>
            <p id="services-sub" className="section-sub">Encuentra la modalidad idónea que más se adapte a tu estilo de vida y necesidades actuales.</p>
          </div>

          <div id="services-cards-grid" className="services-grid">
            
            {/* SERVICE CARD 1 */}
            <div id="service-card-eval" className="service-card">
              <div className="service-icon-heading">
                <Brain size={24} />
              </div>
              <h3 className="service-title">Evaluación Neuropsicológica Inicial</h3>
              <p className="service-description">
                Una valoración integral para comprender tus necesidades emocionales, cognitivas y conductuales, estableciendo una hoja de ruta clara para el proceso terapéutico.
              </p>
              
              <span className="service-includes-title">Incluye:</span>
              <ul className="service-features-list">
                <li className="service-feature-item">
                  <Check size={16} /> Entrevista inicial detallada.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Evaluación clínica y psicométrica.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Identificación de objetivos terapéuticos.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Recomendaciones personalizadas estructuradas.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> Duración de valoración inicial
                </span>
                <span className="service-price-tag">
                  USD $60 <span className="service-price-sub">/ evaluación</span>
                </span>
              </div>

              <button 
                id="service-cta-eval"
                className="btn-premium service-cta-btn" 
                onClick={() => openBookingModal("Evaluación Neuropsicológica Inicial", "USD $60", "Evaluación integral")}
              >
                Reservar evaluación
              </button>
            </div>

            {/* SERVICE CARD 2 (RECOMMENDED) */}
            <div id="service-card-online" className="service-card recommended">
              <span className="badge-recommended">Más Solicitado</span>
              <div className="service-icon-heading">
                <Video size={24} />
              </div>
              <h3 className="service-title">Sesión Individual Online</h3>
              <p className="service-description">
                Atención psicológica desde cualquier lugar de Ecuador mediante videollamada privada y segura.
              </p>
              
              <span className="service-includes-title">Ideal para:</span>
              <ul className="service-features-list" style={{ flexGrow: 1 }}>
                <li className="service-feature-item">
                  <Check size={16} /> Tratamiento de Ansiedad de todo nivel.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Estrés académico o laboral.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Problemas de autoestima y autoconcepto.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Regulación emocional y asertividad.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Procesos de cambio y crecimiento personal.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> Duración: 50 minutos
                </span>
                <span className="service-price-tag" style={{ color: 'var(--color-terracotta-dark)' }}>
                  USD $35 <span className="service-price-sub">/ sesión virtual</span>
                </span>
              </div>

              <button 
                id="service-cta-online"
                className="btn-premium service-cta-btn"
                onClick={() => openBookingModal("Sesión Individual Online", "USD $35", "Cita Online")}
              >
                Agendar sesión online
              </button>
            </div>

            {/* SERVICE CARD 3 */}
            <div id="service-card-presencial" className="service-card">
              <div className="service-icon-heading">
                <MapPin size={24} />
              </div>
              <h3 className="service-title">Sesión Presencial en Guayaquil</h3>
              <p className="service-description">
                Un espacio cómodo, profesional y acogedor para trabajar de forma cercana tus objetivos terapéuticos.
              </p>
              
              <span className="service-includes-title">Incluye:</span>
              <ul className="service-features-list">
                <li className="service-feature-item">
                  <Check size={16} /> Atención personalizada uno a uno.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Plan de trabajo individual ajustado.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Seguimiento continuo del proceso presencial.
                </li>
                <li className="service-feature-item">
                  <Check size={16} /> Ambiente seguro y relajante.
                </li>
              </ul>

              <div className="service-meta-session">
                <span className="service-duration-label">
                  <Clock size={14} /> Duración: 50 minutos
                </span>
                <span className="service-price-tag">
                  USD $40 <span className="service-price-sub">/ sesión física</span>
                </span>
              </div>

              <button 
                id="service-cta-presencial"
                className="btn-premium service-cta-btn"
                onClick={() => openBookingModal("Sesión Presencial en Guayaquil", "USD $40", "Cita Física")}
              >
                Agendar sesión presencial
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

      {/* 6. FORMULARIO DE CONTACTO / AGENDAS CON VALIDACIÓN */}
      <section id="contacto" className="contacto">
        <div className="container contacto-layout">
          <div className="contacto-info">
            <div>
              <span id="contact-tag" className="section-tag">Contacto directo</span>
              <h2 id="contact-heading" className="section-title">Comienza tu Proceso</h2>
              <p id="contact-desc" className="contacto-para" style={{ marginTop: '0.75rem' }}>
                Escríbeme con total tranquilidad. Estoy aquí para aclarar tus dudas antes de agendar o coordinar los horarios que mejor se adapten a ti.
              </p>
            </div>

            <div className="contact-card-direct">
              <div className="contact-direct-item">
                <div className="contact-direct-icon">
                  <Phone size={18} />
                </div>
                <div className="contact-direct-text">
                  <span className="contact-direct-label">WhatsApp de Contacto</span>
                  <span className="contact-direct-value">+593 99 999 9999</span>
                </div>
              </div>

              <div className="contact-direct-item">
                <div className="contact-direct-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-direct-text">
                  <span className="contact-direct-label">Correo Profesional</span>
                  <span className="contact-direct-value">consultas@damarispazmino.com</span>
                </div>
              </div>

              <div className="contact-direct-item">
                <div className="contact-direct-icon">
                  <MapPin size={18} />
                </div>
                <div className="contact-direct-text">
                  <span className="contact-direct-label">Consultorio Físico</span>
                  <span className="contact-direct-value">Guayaquil, Ecuador</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a href="#" className="footer-link" aria-label="Instagram de la Psicóloga" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <Instagram size={20} /> @psic.damarispazmino
              </a>
            </div>
          </div>

          <div id="contact-form-container" className="contact-form-glass-container">
            <h3 className="contact-form-title">
              <MessageSquare size={20} style={{ color: 'var(--color-sage)' }} strokeWidth={2.5} /> Enviar un Mensaje
            </h3>
            
            <form id="scientific-contact-form" className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-field-group">
                <label className="form-label" htmlFor="client-name">Nombre completo *</label>
                <input 
                  type="text" 
                  id="client-name" 
                  className="form-input-control" 
                  placeholder="Ej. Sofía Mendoza" 
                  required 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="form-group-double">
                <div className="form-field-group">
                  <label className="form-label" htmlFor="client-email">Email *</label>
                  <input 
                    type="email" 
                    id="client-email" 
                    className="form-input-control" 
                    placeholder="sofia@ejemplo.com" 
                    required 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label" htmlFor="client-phone">Teléfono / WhatsApp *</label>
                  <input 
                    type="tel" 
                    id="client-phone" 
                    className="form-input-control" 
                    placeholder="Ej. +593 99 123 4567" 
                    required 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="client-service-pref">Servicios de Interés</label>
                <select 
                  id="client-service-pref" 
                  className="form-input-control form-select-control"
                  value={contactService}
                  onChange={(e) => setContactService(e.target.value)}
                >
                  <option value="Asesoría General">Asesoría General / Pregunta Inicial</option>
                  <option value="Evaluación Neuropsicológica">Evaluación Neuropsicológica Inicial (USD $60)</option>
                  <option value="Sesión Online">Sesión Individual Online (USD $35)</option>
                  <option value="Sesión Presencial">Sesión Presencial en Guayaquil (USD $40)</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="client-message">¿En qué situación te encuentras hoy? *</label>
                <textarea 
                  id="client-message" 
                  className="form-input-control form-textarea-control" 
                  placeholder="Por favor, comparte brevemente tu situación o las dudas que deseas resolver..." 
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                ></textarea>
              </div>

              <button 
                id="contact-form-submit-btn" 
                type="submit" 
                className="btn-premium" 
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Enviar mi solicitud
              </button>
            </form>
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
              <span id="footer-branding-title" className="footer-logo-title">Dra. Damaris <span>Pazmiño</span></span>
              <p className="footer-desc">
                Acompañando a adolescentes y jóvenes adultos en el camino del autoconocimiento, la autovaloración constructiva y la regulación afectiva guiada por la ciencia.
              </p>
            </div>

            <div id="footer-navigation-col" className="footer-links-col">
              <span className="footer-col-title">Atajos rápidos</span>
              <ul className="footer-links-list">
                <li><a href="#inicio" className="footer-link" onClick={(e) => { e.preventDefault(); handleScrollTo('inicio'); }}>Inicio</a></li>
                <li><a href="#refugio" className="footer-link" onClick={(e) => { e.preventDefault(); handleScrollTo('refugio'); }}>El Refugio</a></li>
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
            <span>&copy; {new Date().getFullYear()} Dra. Damaris Pazmiño. Todos los derechos reservados.</span>
            <span>Desarrollo de Interfaz Premium de Psicología Clínica.</span>
          </div>
        </div>
      </footer>

      {/* --- FLOATING ACTION BUTTON FOR HEALING AND CALM WRITING --- */}
      <div 
        id="floating-pulsing-action-trigger" 
        className="floating-cta-trigger" 
        style={{ display: scrolled ? 'flex' : 'none' }}
        onClick={() => openBookingModal("Consulta Inmediata Recomendada", "Variable", "Cita Directa")}
        title="Agendar una sesión"
      >
        <div className="pulsing-wave"></div>
        <CalendarCheck size={20} />
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
            <span id="booking-badge-indicator" className="section-tag" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>Reserva Privada Segura</span>
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
