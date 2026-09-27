import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Instagram, ChevronDown, ChevronLeft, ChevronRight, Send, Mail, User, MessageSquare, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import CardSwap, { Card } from './components/CardSwap';
import NetworkBackground from './components/NetworkBackground';
import { getInitialLang, saveLang } from './language';
import { scrollToTarget } from './lib/smoothScroll';

import erpDashboard from './assets/erp-dashboard.png';
import erpStock from './assets/erp-stock.png';
import erpFactura from './assets/erp-factura.png';

import ecomHome from './assets/ecom-home.png';
import ecomCart from './assets/ecom-cart.png';
import ecomDetail from './assets/ecom-detail.png';
import ecomStock from './assets/celulares-stock.jpg';

import landHero from './assets/landing-hero.jpg';
import landFeature from './assets/landing-feature.jpg';
import landMobile from './assets/landing-mobile.jpg';

import javaMenu from './assets/java-inicio.png';
import javaHistorial from './assets/java-historial.png';
import javaGestion from './assets/java-gestion.png';
import javaProductos from './assets/java-productos.png';
import javaUbicaciones from './assets/java-ubicaciones.png';

import turinLogin from './assets/turin-login.png';
import turinPesada from './assets/turin-pesada.jpg';
import turinCaja from './assets/turin-caja.jpg';
import turinEstadistica from './assets/turin-estadisticas.jpg';

import librosPortada from './assets/libros-portada.jpg';

import javaPortada from './assets/java-portada.jpg';

const techLogos = {
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  vite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
  js: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  electron: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg",
  git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  
};

const techStack = [
  { name: "JavaScript", logo: techLogos.js, url: "https://developer.mozilla.org/es/docs/Web/JavaScript" },
  { name: "React", logo: techLogos.react, url: "https://react.dev/" },
  { name: "Node.js", logo: techLogos.node, url: "https://nodejs.org/" },
  { name: "Electron", logo: techLogos.electron, url: "https://www.electronjs.org/" },
  { name: "Java", logo: techLogos.java, url: "https://www.java.com/" }, 
  { name: "MySQL", logo: techLogos.mysql, url: "https://www.mysql.com/" },
  { name: "Vite", logo: techLogos.vite, url: "https://vitejs.dev/" },
  { name: "Tailwind", logo: techLogos.tailwind, url: "https://tailwindcss.com/" },
  { name: "Git", logo: techLogos.git, url: "https://git-scm.com/" },
];

const content = {
  en: {
    portfolioLabel: "PORTFOLIO",
    greeting: "Franco Gianone",
    role: "Full Stack Developer",
    bio: "Totally committed to the philosophy of continuous learning. Passionate about JavaScript, React, and creating scalable web solutions.",
    projectsTitle: "Selected Projects",
    techTitle: "Tech Stack",
    contactTitle: "Get In Touch",
    contactSubtitle: "Have an idea or project? Let's talk.",
    connectTitle: "Let's Connect",
    toggle: "ES",
    formFields: {
        name: "Name",
        email: "Email",
        message: "Message..."
    },
    buttonLabels: {
        idle: "Send",
        sending: "Sending...",
        success: "Sent Successfully!",
        error: "Failed to send"
    },
    projects: [
      {
        id: 5,
        title: "ERP Turin Reciclados",
        desc: "Multi-branch recycling management system. Electron + NestJS + React, industrial scales via serial port, real-time weighing, and PostgreSQL per branch.",
        tags: ["Electron", "NestJS", "PostgreSQL"],
        highlight: true,
        images: [turinLogin, turinCaja, turinPesada, turinEstadistica]
      },
      {
        id: 3,
        title: "Print Shop ERP System",
        desc: "Comprehensive management system. Real-time dashboard, AFIP invoicing, Mercado Pago integration.",
        tags: ["React", "Node.js", "MySQL"],
        highlight: true,
        images: [erpStock, erpDashboard, erpFactura]
      },
      {
        id: 1,
        title: "E-Commerce Frontend",
        desc: "Full cart management, stock logic, data persistence, and advanced filtering.",
        tags: ["React", "State Mgmt", "CSS"],
        highlight: false,
        images: [ecomStock, ecomHome, ecomCart, ecomDetail]
      },
      {
        id: 2,
        title: "Modern Landing Pages",
        desc: "Responsive landing pages designed to maximize user engagement.",
        tags: ["HTML/CSS", "UI/UX", "Responsive"],
        highlight: false,
        images: [landHero, landFeature, landMobile]
      },
      {
        id: 4,
        title: "WMS Java System",
        desc: "Desktop logistics management. Physical location control, ACID transactions, and full traceability.",
        tags: ["Java", "Swing", "MySQL"],
        highlight: false,
        images: [javaPortada, javaMenu, javaHistorial, javaGestion, javaProductos, javaUbicaciones]
      },
      {
        id: 6,
        title: "Book Store — E-Commerce",
        desc: "Full stack final project (MERN): category catalog, cart with Mercado Pago checkout, JWT auth, favorites, subscriptions and admin panel.",
        tags: ["React", "Express", "MongoDB", "Mercado Pago"],
        highlight: false,
        images: [librosPortada]
      }
    ]
  },
  es: {
    portfolioLabel: "PORTAFOLIO",
    greeting: "Franco Gianone",
    role: "Desarrollador Full Stack",
    bio: "Totalmente comprometido con la filosofía del aprendizaje continuo. Apasionado por JavaScript, React y la creación de soluciones web escalables.",
    projectsTitle: "Proyectos Destacados",
    techTitle: "Tecnologías",
    contactTitle: "Contáctame",
    contactSubtitle: "¿Tienes una idea o proyecto? Hablemos.",
    connectTitle: "Conectemos",
    toggle: "EN",
    formFields: {
        name: "Nombre",
        email: "Email",
        message: "Mensaje..."
    },
    buttonLabels: {
        idle: "Enviar",
        sending: "Enviando...",
        success: "¡Enviado con Éxito!",
        error: "Error al enviar"
    },
    projects: [
      {
        id: 5,
        title: "ERP Reciclados Turin",
        desc: "Sistema de gestión multi-sede para reciclado. Electron + NestJS + React, balanzas por puerto serie, pesaje en tiempo real y PostgreSQL por sede.",
        tags: ["Electron", "NestJS", "PostgreSQL"],
        highlight: true,
        images: [turinLogin, turinCaja, turinPesada, turinEstadistica]
      },
      {
        id: 3,
        title: "Sistema ERP para Gráficas",
        desc: "Sistema de gestión integral. Dashboard en tiempo real, facturación AFIP, Mercado Pago.",
        tags: ["React", "Node.js", "MySQL"],
        highlight: true,
        images: [erpStock, erpDashboard, erpFactura]
      },
      {
        id: 1,
        title: "Front E-commerce",
        desc: "Gestión completa de carrito, lógica de stock, persistencia y filtrado avanzado.",
        tags: ["React", "State Mgmt", "CSS"],
        highlight: false,
        images: [ecomStock, ecomHome, ecomCart, ecomDetail]
      },
      {
        id: 2,
        title: "Landing Pages Modernas",
        desc: "Páginas de aterrizaje responsivas diseñadas para maximizar el impacto visual.",
        tags: ["HTML/CSS", "UI/UX", "Responsive"],
        highlight: false,
        images: [landHero, landFeature, landMobile]
      },
      {
        id: 4, 
        title: "Sistema WMS Java",
        desc: "Gestión logística de almacenes. Control de ubicaciones físicas, transacciones ACID y trazabilidad.",
        tags: ["Java", "Swing", "MySQL"],
        highlight: false,
        images: [javaPortada, javaMenu, javaHistorial, javaGestion, javaProductos, javaUbicaciones]
      },
      {
        id: 6,
        title: "Tienda de Libros — E-Commerce",
        desc: "Trabajo final full stack (MERN): catálogo por categorías, carrito con checkout de Mercado Pago, auth JWT, favoritos, suscripciones y panel de administración.",
        tags: ["React", "Express", "MongoDB", "Mercado Pago"],
        highlight: false,
        images: [librosPortada]
      }
    ]
  }
};

const ProjectCard = ({ project }) => {
    const [currentImg, setCurrentImg] = useState(0);

    const nextImage = (e) => { e.stopPropagation(); setCurrentImg((p) => (p + 1) % project.images.length); };
    const prevImage = (e) => { e.stopPropagation(); setCurrentImg((p) => (p - 1 + project.images.length) % project.images.length); };

    return (
        <div className="relative h-full w-full flex flex-col">
            {project.highlight && (
                <div className="absolute top-5 right-5 bg-neon-blue text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_12px_#00f3ff] z-30">MVP</div>
            )}

            <div className="relative flex-1 min-h-0 overflow-hidden bg-black/40">
                {project.images.length > 0 ? (
                    <>
                        <img src={project.images[currentImg]} alt={project.title} loading="lazy" decoding="async" draggable={false} className="w-full h-full object-cover" />
                        {project.images.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-neon-blue hover:text-black text-white p-2.5 rounded-full transition z-30"><ChevronLeft size={22} /></button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-neon-blue hover:text-black text-white p-2.5 rounded-full transition z-30"><ChevronRight size={22} /></button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                                    {project.images.map((_, i) => (
                                        <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }} className={`w-2 h-2 rounded-full transition ${i === currentImg ? 'bg-neon-blue' : 'bg-white/40 hover:bg-white/70'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-neon-blue font-mono text-sm tracking-widest">Screenshots soon</span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            </div>

            <div className="p-8">
                <h4 className="text-2xl font-bold text-white mb-3">{project.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-mono text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-2.5 py-1 rounded">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};


function App() {
  const [lang, setLang] = useState(getInitialLang);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const t = content[lang];
  const navigate = useNavigate();
  const swapRef = useRef(null);
  // El contador se actualiza por ref (sin estado): cada rotación del mazo
  // no dispara un re-render de toda la home.
  const counterRef = useRef(null);
  const frontIndexRef = useRef(0);
  const projectsRef = useRef(t.projects);
  projectsRef.current = t.projects;

  const form = useRef();
  const [buttonState, setButtonState] = useState('idle'); 

  const sendEmail = (e) => {
    e.preventDefault();
    setButtonState('sending');

    emailjs.sendForm('service_2t6qwor', 'template_i9wqymc', form.current, 'I1FzSRpE-0ic0Stur')
      .then((result) => {
          console.log(result.text);
          setButtonState('success');
          e.target.reset(); 
          setTimeout(() => setButtonState('idle'), 3000); 
      }, (error) => {
          console.log(error.text);
          setButtonState('error');
          setTimeout(() => setButtonState('idle'), 3000);
      });
  };

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
       if (window.scrollY > 10) { setShowScrollArrow(false); } else { setShowScrollArrow(true); }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Al cambiar de idioma, re-sincronizar el contador con la card frontal actual
  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = `${frontIndexRef.current + 1} / ${t.projects.length}`;
    }
  }, [lang]);

  const toggleLang = () => setLang(prev => {
    const next = prev === 'en' ? 'es' : 'en';
    saveLang(next);
    return next;
  });

  // Al volver de la página de un proyecto: traer esa card al frente del mazo
  useEffect(() => {
    const lastId = Number(sessionStorage.getItem('lastOpenedProject'));
    if (!lastId) return;
    const idx = t.projects.findIndex((p) => p.id === lastId);
    if (idx !== -1) {
      swapRef.current?.bringToFront(idx);
    }
    sessionStorage.removeItem('lastOpenedProject');
  }, [t.projects]);

  return (
    <div className="bg-dark text-gray-200 min-h-screen font-sans overflow-x-hidden selection:bg-neon-blue selection:text-black">
      
      <motion.div className="fixed top-0 right-0 bottom-0 w-[2px] bg-neon-blue origin-top z-50 shadow-[0_0_15px_#00f3ff]" style={{ scaleY }} />

      <nav className="fixed top-6 right-8 z-40">
        <button onClick={toggleLang} className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:border-neon-blue/50 transition flex items-center gap-2 text-xs font-bold tracking-widest text-white">{t.toggle}</button>
      </nav>

      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative text-center overflow-hidden">
        <NetworkBackground />

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-3xl z-10 relative">
          <h2 className="text-neon-blue tracking-[0.2em] text-sm mb-6 uppercase font-bold">{t.portfolioLabel}</h2>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">{t.greeting}</h1>
          <p className="text-2xl md:text-3xl text-gray-300 font-light mb-8">{t.role}</p>
          <p className="text-gray-500 leading-relaxed mx-auto text-lg">{t.bio}</p>
        </motion.div>

        <AnimatePresence>
          {showScrollArrow && (
            <motion.button
                type="button"
                onClick={() => scrollToTarget(document.getElementById('tecnologias'))}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.2 }}
                className="absolute bottom-10 text-neon-blue hover:text-white z-20 cursor-pointer transition-colors"
                aria-label={lang === 'en' ? 'Scroll down to tech stack' : 'Bajar a tecnologías'}
            >
                <motion.span
                    className="block"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown size={32} />
                </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </section>

      <section id="tecnologias" className="py-32 bg-dark-lighter/50">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h3 className="text-2xl font-bold mb-12 inline-block border-b-4 border-neon-blue pb-2 text-white">{t.techTitle}</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {techStack.map((tech, i) => (
              <a key={i} href={tech.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group cursor-pointer">
                <motion.div whileHover={{ y: -5 }} className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-neon-blue/50 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all duration-300">
                  <img src={tech.logo} alt={tech.name} className="w-full h-full object-contain" />
                </motion.div>
                <span className="text-sm font-mono text-gray-500 group-hover:text-white transition">{tech.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-20 pb-10 overflow-hidden relative">
        <div className="relative z-20 text-center px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.projectsTitle}</h3>
          <p className="text-gray-500 text-sm font-mono">▹ {lang === 'en' ? 'Use the mouse wheel over a card to rotate' : 'Usá la rueda del mouse sobre una card para rotar'} ▸</p>
        </div>

        <div className="relative z-0 pt-80">
          <CardSwap
            ref={swapRef}
            width="min(94vw, 1300px)"
            height="min(84vh, 780px)"
            cardDistance={115}
            verticalDistance={60}
            easing="elastic"
            skewAmount={4}
            onCardClick={(idx) => {
              sessionStorage.setItem('lastOpenedProject', String(t.projects[idx].id));
              navigate(`/project/${t.projects[idx].id}`);
            }}
            onFrontChange={(idx) => {
              frontIndexRef.current = idx;
              if (counterRef.current) {
                counterRef.current.textContent = `${idx + 1} / ${projectsRef.current.length}`;
              }
            }}
          >
            {t.projects.map((project) => (
              <Card key={project.id}>
                <ProjectCard project={project} />
              </Card>
            ))}
          </CardSwap>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-4 mt-20">
          <button
            onClick={() => swapRef.current?.prev()}
            className="bg-black/50 border border-white/10 hover:border-neon-blue/60 hover:bg-white/10 text-white p-3 rounded-full transition"
            aria-label={lang === 'en' ? 'Previous' : 'Anterior'}
          >
            <ChevronLeft size={22} />
          </button>
          <span ref={counterRef} className="font-mono text-sm text-gray-500">
            {`1 / ${t.projects.length}`}
          </span>
          <button
            onClick={() => swapRef.current?.next()}
            className="bg-black/50 border border-white/10 hover:border-neon-blue/60 hover:bg-white/10 text-white p-3 rounded-full transition"
            aria-label={lang === 'en' ? 'Next' : 'Siguiente'}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      <section className="mt-32 py-32 bg-gradient-to-b from-transparent to-black/80">
        <div className="container mx-auto px-6 max-w-5xl">
          <h3 className="text-3xl font-bold text-white mb-12 text-center md:text-left md:border-l-4 md:border-neon-blue md:pl-6">{t.contactTitle}</h3>
          
          <div className="grid md:grid-cols-2 gap-12">
            
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <p className="text-gray-400 mb-6">{t.contactSubtitle}</p>
              
              <div className="relative">
                <User className="absolute left-4 top-3 text-gray-500" size={20} />
                <input name="user_name" type="text" required placeholder={t.formFields.name} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition" />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-gray-500" size={20} />
                <input name="user_email" type="email" required placeholder={t.formFields.email} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition" />
              </div>
              
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3 text-gray-500" size={20} />
                <textarea name="message" required rows="4" placeholder={t.formFields.message} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={buttonState !== 'idle'}
                className={`w-full font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all duration-300
                    ${buttonState === 'idle' ? 'bg-neon-blue text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]' : ''}
                    ${buttonState === 'sending' ? 'bg-gray-600 text-white cursor-wait' : ''}
                    ${buttonState === 'success' ? 'bg-green-500 text-black' : ''}
                    ${buttonState === 'error' ? 'bg-red-500 text-white' : ''}
                `}
              >
                {buttonState === 'idle' && <><Send size={18} /> {t.buttonLabels.idle}</>}
                {buttonState === 'sending' && t.buttonLabels.sending}
                {buttonState === 'success' && t.buttonLabels.success}
                {buttonState === 'error' && t.buttonLabels.error}
              </button>
            </form>

            <div className="flex flex-col justify-center space-y-6 p-8 bg-white/5 rounded-3xl border border-white/5">
              <h4 className="text-xl font-bold text-white mb-2">{t.connectTitle}</h4>
              <div className="flex flex-col gap-4 w-full">
                
                <a href="https://wa.me/5493442478528?text=Hola%20Franco,%20vi%20tu%20portafolio%20y%20me%20gustaría%20contactarte." target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-white transition group bg-black/20 p-4 rounded-xl border border-transparent hover:border-green-500/50">
                  <Phone className="text-green-500 group-hover:scale-110 transition" size={24} />
                  <span className="font-mono">WhatsApp</span>
                </a>

                <a href="https://www.linkedin.com/in/franco-gianone-02527a206/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-white transition group bg-black/20 p-4 rounded-xl border border-transparent hover:border-white/10"><Linkedin className="text-neon-blue group-hover:scale-110 transition" size={24} /><span className="font-mono">LinkedIn</span></a>
                <a href="https://www.instagram.com/francogianone/?hl=es-la" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-white transition group bg-black/20 p-4 rounded-xl border border-transparent hover:border-white/10"><Instagram className="text-neon-blue group-hover:scale-110 transition" size={24} /><span className="font-mono">Instagram</span></a>
                <a href="https://github.com/francogianone" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-white transition group bg-black/20 p-4 rounded-xl border border-transparent hover:border-white/10"><Github className="text-neon-blue group-hover:scale-110 transition" size={24} /><span className="font-mono">GitHub</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-700 text-xs border-t border-white/5">
        <p>© 2026 Franco. Built with React, Vite & Tailwind.</p>
      </footer>
    </div>
  );
}

export default App;
