import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Linkedin, Instagram, ChevronDown, Send, Mail, User, MessageSquare, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser'; 

import erpDashboard from './assets/erp-dashboard.png';
import erpStock from './assets/erp-stock.png';
import erpFactura from './assets/erp-factura.png';

import ecomHome from './assets/ecom-home.png';
import ecomCart from './assets/ecom-cart.png';
import ecomDetail from './assets/ecom-detail.png';

import landHero from './assets/landing-hero.png';
import landFeature from './assets/landing-feature.png';
import landMobile from './assets/landing-mobile.png';

import javaMenu from './assets/java-inicio.png';
import javaHistorial from './assets/java-historial.png';
import javaGestion from './assets/java-gestion.png';
import javaProductos from './assets/java-productos.png';
import javaUbicaciones from './assets/java-ubicaciones.png';

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
        images: [ecomHome, ecomCart, ecomDetail]
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
        images: [javaMenu, javaHistorial, javaGestion, javaProductos, javaUbicaciones]
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
        images: [ecomHome, ecomCart, ecomDetail]
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
        images: [javaMenu, javaHistorial, javaGestion, javaProductos, javaUbicaciones]
      }
    ]
  }
};

const ProjectCard = ({ project }) => {
    const [currentImg, setCurrentImg] = useState(0);

    const nextImage = (e) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentImg((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = (e) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentImg((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    return (
        <Link to={`/project/${project.id}`} className="block h-full w-full">
            <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                className={`w-[85vw] md:w-[450px] p-6 pb-8 rounded-3xl border ${project.highlight ? 'border-neon-blue/30 bg-gradient-to-br from-white/5 to-neon-blue/5' : 'border-white/10 bg-white/5'} backdrop-blur-sm relative flex flex-col h-full group hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] transition-all duration-300`}
            >
                {project.highlight && (
                    <div className="absolute -top-3 right-8 bg-neon-blue text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_#00f3ff] z-20">MVP</div>
                )}
                
                <h4 className="text-2xl font-bold text-white mb-4 mt-2 group-hover:text-neon-blue transition">{project.title}</h4>

                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 group/image bg-black/40 shadow-inner">
                    <img src={project.images[currentImg]} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-neon-blue hover:text-black text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition z-30 pointer-events-auto"><ChevronLeft size={18} /></button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-neon-blue hover:text-black text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition z-30 pointer-events-auto"><ChevronRight size={18} /></button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                        {project.images.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentImg ? 'bg-neon-blue' : 'bg-white/50'}`} />
                        ))}
                    </div>
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed text-sm flex-grow">{project.desc}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-mono text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-2 py-1 rounded">{tag}</span>
                    ))}
                </div>
                
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition text-neon-blue"><ExternalLink size={20} /></div>
            </motion.div>
        </Link>
    );
};


function App() {
  const [lang, setLang] = useState('es');
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const t = content[lang];
  const scrollRef = useRef(null);
  
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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        if (el.scrollWidth > el.clientWidth) {
            e.preventDefault();
            el.scrollTo({ left: el.scrollLeft + e.deltaY * 2.5, behavior: "smooth" });
        }
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'es' : 'en');

  return (
    <div className="bg-dark text-gray-200 min-h-screen font-sans overflow-x-hidden selection:bg-neon-blue selection:text-black">
      
      <motion.div className="fixed top-0 right-0 bottom-0 w-[2px] bg-neon-blue origin-top z-50 shadow-[0_0_15px_#00f3ff]" style={{ scaleY }} />

      <nav className="fixed top-6 right-8 z-40">
        <button onClick={toggleLang} className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:border-neon-blue/50 transition flex items-center gap-2 text-xs font-bold tracking-widest text-white">{t.toggle}</button>
      </nav>

      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative text-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] absolute" 
            />
            <motion.div 
                animate={{ x: [-50, 50, -50], y: [-30, 30, -30], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] absolute" 
            />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-3xl z-10 relative">
          <h2 className="text-neon-blue tracking-[0.2em] text-sm mb-6 uppercase font-bold">{t.portfolioLabel}</h2>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">{t.greeting}</h1>
          <p className="text-2xl md:text-3xl text-gray-300 font-light mb-8">{t.role}</p>
          <p className="text-gray-500 leading-relaxed mx-auto text-lg">{t.bio}</p>
        </motion.div>

        <AnimatePresence>
          {showScrollArrow && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} 
                className="absolute bottom-10 text-neon-blue z-20 pointer-events-none"
            >
                <ChevronDown size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="py-32 bg-dark-lighter/50">
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

      <section className="py-20 overflow-hidden relative">
        <div className="container mx-auto px-6 max-w-6xl text-center md:text-left">
           <h3 className="text-3xl font-bold text-white inline-block md:block md:border-l-4 md:border-neon-blue md:pl-6">{t.projectsTitle}</h3>
        </div>
        <div ref={scrollRef} className="flex px-6 py-16 gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing w-full">
          {t.projects.map((project) => (
            <div key={project.id} className="snap-center shrink-0 first:ml-auto last:mr-auto">
                 <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-transparent to-black/80">
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
