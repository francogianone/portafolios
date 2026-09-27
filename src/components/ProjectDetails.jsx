import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { getInitialLang, saveLang } from '../language';


import erpMain from '../assets/erp-stock.png';
import erpOrders from '../assets/erp-ordenes.png';
import erpAfip from '../assets/erp-factura.png';
import erpDash from '../assets/erp-dashboard.png';

import ecomMain from '../assets/ecom-home.png';
import ecomCart from '../assets/ecom-cart.png';
import ecomDetail from '../assets/ecom-detail.png';

import landHero from '../assets/landing-hero.jpg';
import landAbout from '../assets/landing-feature.jpg';
import land from '../assets/landing-mobile.jpg';

import javaInicio from '../assets/java-inicio.png';
import javaHist from '../assets/java-historial.png';
import javaGest from '../assets/java-gestion.png';
import javaProd from '../assets/java-productos.png';
import javaUbi from '../assets/java-ubicaciones.png';

import turinLogin from '../assets/turin-login.png';
import turinPesada from '../assets/turin-pesada.jpg';
import turinCaja from '../assets/turin-caja.jpg';
import turinEstadistica from '../assets/turin-estadisticas.jpg';

import librosPortada from '../assets/libros-portada.jpg';
import librosCatalogo from '../assets/libros-catalogo.jpg';
import librosHome from '../assets/libros-home.jpg';
import librosCarrito from '../assets/libros-carrito.jpg';
import librosMp from '../assets/libros-mp.jpg';
import librosSmtp from '../assets/libros-smtp.jpg';



const projectsExtendedData = {
  es: {
    1: { 
      title: "E-Commerce Frontend JS Básico",
      fullDesc: "Aplicación de comercio electrónico simulada, construida con JavaScript puro (Vanilla JS) y arquitectura modular. El sistema emula una experiencia de compra completa sin necesidad de base de datos, utilizando archivos JSON locales y LocalStorage para la persistencia de datos. Está listo para ser adaptado y formar un E-Commerce completo. Se destaca por su lógica de negocio en el frontend, que controla el stock en tiempo real entre las distintas vistas (Catálogo, Detalle y Carrito), impidiendo inconsistencias en los pedidos.",
      features: [
          "Persistencia de Datos: Implementación de LocalStorage para mantener el estado del carrito incluso al cerrar el navegador o recargar la página.",
          "Control de Stock Inteligente: El sistema calcula la disponibilidad real restando los ítems ya añadidos al carrito, deshabilitando botones automáticamente cuando se agota el stock.",
          "Sistema de Notificaciones UI: Feedbacks visuales mediante 'Toasts' personalizados para acciones de agregado y Modales de confirmación para eliminación de ítems.",
          "Validación de Formularios Nativa: Validación en tiempo real en las secciones de Checkout y Contacto utilizando la API de validación de HTML5 y clases visuales dinámicas."
      ],
      stack: ["JavaScript (ES6 Modules)", "Fetch API", "LocalStorage", "HTML5 / CSS3", "JSON Data"],
      images: [ecomMain, ecomCart, ecomDetail],
      links: { github: "https://github.com/francogianone/e-commerce/", demo: "https://francogianone.com.ar/ecommerce-cellshop/" }
    },
    2: { 
      title: "Landing Page Institucional",
      fullDesc: "Página de aterrizaje interactiva y 'Mobile-First' diseñada para ofrecer una navegación fluida e intuitiva. El desarrollo se centró en la manipulación del DOM mediante JavaScript para crear una experiencia de usuario dinámica sin depender de frameworks pesados. Cuenta con un sistema de navegación inteligente que detecta la dirección del scroll para maximizar el área visible de contenido y guiar al usuario a través de las secciones de Inicio, Acerca, Galería y Ubicación.",
      features: [
          "Smart Navbar: El menú superior se oculta automáticamente al bajar (scroll down) para dar protagonismo al contenido y reaparece al subir.",
          "Menú Móvil Interactivo: Sistema 'Hamburger' personalizado con animaciones de entrada lateral y cierre automático al seleccionar una sección.",
          "Botón 'Go Top' Dinámico: Aparece estratégicamente después de los 600px de scroll para facilitar el retorno al inicio.",
          "Feedback Visual: Cambio de estilos en el header (bordes de color #ff2e63) basado en la posición del scroll."
      ],
      stack: ["JavaScript (ES6)", "jQuery", "CSS3", "HTML5"],
      images: [landHero, landAbout, land],
      links: { github: "https://github.com/francogianone/islacaridad/tree/main/Isla%20Caridad%202023", demo: "https://islacaridad.vercel.app/" }
    },
    3: { 
      title: "Sistema ERP de Gestión & Facturación",
      fullDesc: "Sistema integral de gestión empresarial (ERP) desarrollado para optimizar los procesos operativos de una gráfica/imprenta. La aplicación utiliza una arquitectura híbrida: funciona como una aplicación de escritorio nativa gracias a Electron, pero está construida con tecnologías web modernas (React). El backend gestiona lógica crítica de negocio, destacando la integración con servicios externos como AFIP para facturación y Mercado Pago para la unificación de canales de cobro.",
      features: [
          "Facturación Electrónica AFIP: Integración directa con Web Services de AFIP (WSFE) para autorización de comprobantes (CAE) en tiempo real y generación de PDFs fiscales.",
          "Conciliación Mercado Pago: Conexión con la API de Mercado Pago para monitorear y visualizar transferencias entrantes y pagos acreditados en tiempo real, facilitando el control de caja sin salir del sistema.",
          "Arquitectura Híbrida Electron: Empaquetado como software de escritorio para acceso a hardware local (impresoras térmicas, sistema de archivos) y mejor rendimiento.",
          "Cloud Storage Integration: Módulo de respaldo que sincroniza automáticamente presupuestos y facturas con Google Drive API para evitar pérdida de datos.",
          "Gestión Financiera Completa: Módulos de Caja diaria con cierre automático, cuentas corrientes de clientes y reportes de movimientos."
      ],
      stack: ["React", "Electron", "Node.js (Express)", "MySQL", "AFIP Web Services", "Mercado Pago API", "Google Drive API"],
      images: [erpMain, erpDash, erpOrders, erpAfip],
      links: { demo: "https://francogianone.com.ar/dc-demo" }
    },
    4: {
      title: "Sistema de Gestión de Almacenes (WMS)",
      fullDesc: "Aplicación de escritorio robusta desarrollada en Java para la logística de depósitos. A diferencia de un inventario simple, este sistema implementa un control estricto de restricciones físicas y lógicas de negocio. Utiliza un mapeo jerárquico de ubicaciones (Zona > Nave > Estantería > Nivel) y valida en tiempo real la capacidad de carga antes de autorizar cualquier ingreso. Su arquitectura asegura la consistencia de los datos mediante transacciones atómicas, evitando errores de stock durante operaciones críticas como transformaciones o movimientos masivos.",
      features: [
          "Mapeo Físico Jerárquico: Gestión precisa de inventario organizada por Zona, Nave, Estantería y Nivel, permitiendo una localización exacta de la mercadería.",
          "Control de Capacidad Inteligente: Algoritmo de validación que impide el ingreso de mercadería si la ubicación destino supera su límite de peso (1250 kg), previniendo sobrecargas físicas.",
          "Integridad Transaccional (ACID): Implementación de commits y rollbacks manuales vía JDBC. Si una parte de una transformación falla, el sistema revierte automáticamente todos los cambios para no corromper el stock.",
          "Historial de Auditoría Inmutable: Registro automático de cada operación (Ingreso, Egreso, Movimiento Interno) vinculando usuario, fecha, producto y ubicación afectada.",
          "Arquitectura DAO: Separación limpia entre la interfaz Swing y la lógica de datos, facilitando el mantenimiento y la escalabilidad del código."
      ],
      stack: ["Java SE", "Swing UI", "MySQL", "JDBC"],
      images: [javaInicio, javaHist, javaGest, javaProd, javaUbi],
      links: { github: "https://github.com/francogianone/sistema-wms-java", demo: "https://www.youtube.com/watch?v=5_aNNMltbLM" }
    },
    5: {
      title: "Sistema de Gestión — Turin Reciclados",
      fullDesc: "Sistema integral de gestión para una empresa de reciclado multi-sede, construido como monorepo con tres capas: una aplicación de escritorio Windows (Electron) que funciona como cliente, un backend NestJS que corre como proceso independiente gestionado con PM2 en los servidores de cada sede, y una SPA en React + Vite. Cada sede cuenta con su propia base PostgreSQL, y todas se conectan entre sí mediante VPN Tailscale, permitiendo elegir en el login entre el servidor local o remoto. El sistema cubre todo el ciclo operativo del negocio: compra de materiales, pesaje con balanzas conectadas por puerto serie, clientes, tesororería, agenda y estadísticas en tiempo real.",
      features: [
          "Arquitectura Multi-Sede: Una base de datos PostgreSQL por sede, interconectadas vía VPN Tailscale, con selección de servidor local o remoto desde el login.",
          "Integración con Balanzas: Comunicación en tiempo real con balanzas industriales por puerto serie (SerialPort), transmitiendo el pesaje directamente al sistema vía Socket.IO.",
          "Impresión de Tickets Directa: Generación de tickets como imágenes (PNG.js) e impresión RAW sin drivers desde Electron, tanto local como en el servidor de sede.",
          "Backend Independiente con PM2: El API NestJS corre fuera de Electron como servicio en Windows, con scripts de despliegue automatizado por sede.",
          "Estadísticas y Reportes: Dashboards con gráficos (Recharts) y exportación de reportes a Excel (ExcelJS).",
          "CI/CD Completo: Pipeline de GitHub Actions que construye y publica el instalador Windows (.exe NSIS) con cada push a main."
      ],
      stack: ["Electron 41", "NestJS 11", "React 19", "Vite 8", "TypeScript", "PostgreSQL", "TypeORM", "Socket.IO", "Tailwind CSS 4", "SerialPort", "PM2", "GitHub Actions"],
      images: [turinLogin, turinPesada, turinCaja, turinEstadistica],
      links: { demo: "https://francogianone.com.ar/turin-demo" }
    },
    6: {
      title: "Tienda de Libros — E-Commerce Full Stack",
      fullDesc: "Trabajo final: e-commerce de libros full stack (MERN). El frontend está construido con React 19 + Vite y CSS vanilla, mientras que el backend es un API REST en Node.js + Express con MongoDB (Mongoose). Incluye catálogo de libros por categorías con búsqueda y filtros, carrito de compras global persistente con checkout de Mercado Pago, autenticación JWT con recuperación de contraseña por email vía SMTP de Brevo, favoritos por usuario, suscripciones pagas con webhook de confirmación y un panel de administración con CRUD de productos y permisos por rol.",
      features: [
          "Catálogo por categorías: novedades, más vendidos, clásicos, arte, negocios, ciencia ficción, tango y cómics, servidos desde MongoDB con búsqueda y filtrado en la home.",
          "Carrito global con Context de React: agregar/quitar productos, ajustar cantidades, cálculo de subtotales, descuento y total, con persistencia en localStorage.",
          "Checkout con Mercado Pago: creación de preference desde el drawer del carrito y redirección al flujo de pago.",
          "Autenticación JWT + bcrypt: registro, login, sesión persistente en localStorage y recuperación de contraseña por email con Nodemailer sobre SMTP de Brevo.",
          "Favoritos y suscripciones: favoritos por usuario persistidos en el backend y planes de suscripción con pago y webhook de confirmación.",
          "Panel de administración con roles: CRUD completo de libros para usuarios isAdmin y validación de permisos (isAdmin / isEmployee)."
      ],
      stack: ["React 19", "Vite", "Node.js + Express", "MongoDB + Mongoose", "JWT + Bcrypt", "Nodemailer + Brevo SMTP", "Mercado Pago", "CSS3"],
      images: [librosPortada, librosCatalogo, librosHome, librosCarrito, librosMp, librosSmtp],
      links: { demo: "https://francogianone.com.ar/ecommerce-libros" }
    }
  },
  en: {
    1: { 
      title: "Basic JS Frontend E-Commerce",
      fullDesc: "Simulated e-commerce application built with pure JavaScript (Vanilla JS) and modular architecture. The system emulates a complete shopping experience without a database, using local JSON files and LocalStorage for data persistence. It is ready to be adapted into a full E-Commerce solution. It stands out for its frontend business logic, which controls stock in real-time across different views (Catalog, Detail, and Cart), preventing order inconsistencies.",
      features: [
          "Data Persistence: LocalStorage implementation to maintain cart state even after closing the browser or reloading the page.",
          "Smart Stock Control: The system calculates real availability by subtracting items already added to the cart, automatically disabling buttons when stock runs out.",
          "UI Notification System: Visual feedback via custom 'Toasts' for add actions and confirmation Modals for item removal.",
          "Native Form Validation: Real-time validation in Checkout and Contact sections using the HTML5 validation API and dynamic visual classes."
      ],
      stack: ["JavaScript (ES6 Modules)", "Fetch API", "LocalStorage", "HTML5 / CSS3", "JSON Data"],
      images: [ecomMain, ecomCart, ecomDetail],
      links: { github: "https://github.com/francogianone/e-commerce/", demo: "https://francogianone.com.ar/ecommerce-cellshop/" }
    },
    2: { 
      title: "Institutional Landing Page",
      fullDesc: "Interactive 'Mobile-First' landing page designed to offer fluid and intuitive navigation. Development focused on DOM manipulation via JavaScript to create a dynamic user experience without relying on heavy frameworks. It features a smart navigation system that detects scroll direction to maximize visible content area and guide the user through Home, About, Gallery, and Location sections.",
      features: [
          "Smart Navbar: The top menu automatically hides on scroll down to prioritize content and reappears on scroll up.",
          "Interactive Mobile Menu: Custom 'Hamburger' system with side-entry animations and automatic closing upon section selection.",
          "Dynamic 'Go Top' Button: Strategically appears after 600px of scrolling to facilitate returning to the top.",
          "Visual Feedback: Header style changes (color borders) based on scroll position."
      ],
      stack: ["JavaScript (ES6)", "jQuery", "CSS3", "HTML5"],
      images: [landHero, landAbout, land],
      links: { github: "https://github.com/francogianone/islacaridad/tree/main/Isla%20Caridad%202023", demo: "https://islacaridad.vercel.app/" }
    },
    3: { 
      title: "ERP Management & Invoicing System",
      fullDesc: "Comprehensive Enterprise Resource Planning (ERP) system developed to optimize operational processes for a printing company. The application uses a hybrid architecture: it functions as a native desktop application thanks to Electron but is built with modern web technologies (React). The backend manages critical business logic, highlighting integration with external services like AFIP for invoicing and Mercado Pago for payment unification.",
      features: [
          "AFIP Electronic Invoicing: Direct integration with AFIP Web Services (WSFE) for real-time voucher authorization (CAE) and fiscal PDF generation.",
          "Mercado Pago Reconciliation: Connection with the Mercado Pago API to monitor and visualize incoming transfers and credited payments in real-time, facilitating cash control without leaving the system.",
          "Hybrid Electron Architecture: Packaged as desktop software for local hardware access (thermal printers, file system) and better performance.",
          "Cloud Storage Integration: Backup module that automatically synchronizes quotes and invoices with Google Drive API to prevent data loss.",
          "Complete Financial Management: Modules for Daily Cash Close, Customer Current Accounts, and movement reports."
      ],
      stack: ["React", "Electron", "Node.js (Express)", "MySQL", "AFIP Web Services", "Mercado Pago API", "Google Drive API"],
      images: [erpMain, erpDash, erpOrders, erpAfip],
      links: { demo: "https://francogianone.com.ar/dc-demo" }
    },
    4: {
      title: "WMS Logistics System",
      fullDesc: "Robust desktop application developed in Java for warehouse logistics. Unlike simple inventory software, this system implements strict physical constraints and business logic control. It uses a hierarchical location mapping (Zone > Aisle > Rack > Level) and validates load capacity in real-time before authorizing any entry. Its architecture ensures data consistency through atomic transactions, preventing stock errors during critical operations like transformations or bulk movements.",
      features: [
          "Hierarchical Physical Mapping: Precise inventory management organized by Zone, Aisle, Rack, and Level, allowing exact merchandise localization.",
          "Intelligent Capacity Control: Validation algorithm that prevents merchandise entry if the destination location exceeds its weight limit (1250 kg), preventing physical overloads.",
          "Transactional Integrity (ACID): Implementation of manual JDBC commits and rollbacks. If part of a transformation fails, the system automatically reverts all changes to avoid corrupting stock.",
          "Immutable Audit History: Automatic recording of every operation (Entry, Exit, Internal Movement) linking user, date, product, and affected location.",
          "DAO Architecture: Clean separation between the Swing interface and data logic, facilitating code maintenance and scalability."
      ],
      stack: ["Java SE", "Swing UI", "MySQL", "JDBC"],
      images: [javaInicio, javaHist, javaGest, javaProd, javaUbi],
      links: { github: "https://github.com/francogianone/sistema-wms-java", demo: "https://www.youtube.com/watch?v=5_aNNMltbLM" }
    },
    5: {
      title: "Management System — Turin Reciclados",
      fullDesc: "Comprehensive management system for a multi-branch recycling company, built as a three-layer monorepo: a Windows desktop application (Electron) acting as the client, a NestJS backend running as an independent process managed with PM2 on each branch's server, and a React + Vite SPA. Each branch has its own PostgreSQL database, all interconnected via Tailscale VPN, allowing server selection (local or remote) at login. The system covers the full business cycle: material purchasing, weighing with serial-port connected scales, clients, treasury, agenda, and real-time statistics.",
      features: [
          "Multi-Branch Architecture: One PostgreSQL database per branch, interconnected via Tailscale VPN, with local or remote server selection from the login screen.",
          "Scale Integration: Real-time communication with industrial scales via serial port (SerialPort), streaming weight data directly into the system through Socket.IO.",
          "Direct Ticket Printing: Tickets generated as images (PNG.js) and printed RAW without drivers from Electron, both locally and on branch servers.",
          "Standalone Backend with PM2: The NestJS API runs outside Electron as a Windows service, with automated deployment scripts per branch.",
          "Statistics and Reports: Dashboards with charts (Recharts) and Excel report export (ExcelJS).",
          "Full CI/CD: GitHub Actions pipeline that builds and publishes the Windows installer (.exe NSIS) on every push to main."
      ],
      stack: ["Electron 41", "NestJS 11", "React 19", "Vite 8", "TypeScript", "PostgreSQL", "TypeORM", "Socket.IO", "Tailwind CSS 4", "SerialPort", "PM2", "GitHub Actions"],
      images: [turinLogin, turinPesada, turinCaja, turinEstadistica],
      links: { demo: "https://francogianone.com.ar/turin-demo" }
    },
    6: {
      title: "Book Store — Full Stack E-Commerce",
      fullDesc: "Final project: a full stack (MERN) book e-commerce. The frontend is built with React 19 + Vite and vanilla CSS, while the backend is a REST API in Node.js + Express with MongoDB (Mongoose). It includes a category-based book catalog with search and filters, a persistent global shopping cart with Mercado Pago checkout, JWT authentication with email password recovery via Brevo SMTP, per-user favorites, paid subscriptions with a confirmation webhook, and an admin panel with product CRUD and role-based permissions.",
      features: [
          "Category catalog: new releases, best sellers, classics, art, business, sci-fi, tango and comics, served from MongoDB with search and filtering on the home page.",
          "Global cart with React Context: add/remove products, adjust quantities, subtotal/discount/total calculation, with localStorage persistence.",
          "Mercado Pago checkout: preference creation from the cart drawer and redirection to the payment flow.",
          "JWT auth + bcrypt: registration, login, persistent session in localStorage and email password recovery via Nodemailer over Brevo SMTP.",
          "Favorites and subscriptions: per-user favorites stored in the backend and subscription plans with payment and confirmation webhook.",
          "Admin panel with roles: full book CRUD for isAdmin users and permission validation (isAdmin / isEmployee)."
      ],
      stack: ["React 19", "Vite", "Node.js + Express", "MongoDB + Mongoose", "JWT + Bcrypt", "Nodemailer + Brevo SMTP", "Mercado Pago", "CSS3"],
      images: [librosPortada, librosCatalogo, librosHome, librosCarrito, librosMp, librosSmtp],
      links: { demo: "https://francogianone.com.ar/ecommerce-libros" }
    }
  }
};


const ProjectDetails = () => {
  const { id } = useParams();
  const [lang, setLang] = useState(getInitialLang); 

  const t = projectsExtendedData[lang]?.[id] || { 
      title: lang === 'en' ? "Project not found" : "Proyecto no encontrado", 
      fullDesc: lang === 'en' ? "The project you are looking for does not exist." : "El proyecto que buscas no existe.", 
      images: [], features: [], stack: [] 
  };

  const toggleLang = () => setLang(prev => {
    const next = prev === 'en' ? 'es' : 'en';
    saveLang(next);
    return next;
  });

  return (
    <div className="bg-dark text-gray-200 min-h-screen font-sans selection:bg-neon-blue selection:text-black pb-20">
      

      <nav className="fixed top-6 left-8 z-40">
        <Link to="/">
            <button className="backdrop-blur-md bg-black/50 border border-white/10 px-4 py-2 rounded-full hover:border-neon-blue/50 transition flex items-center gap-2 text-sm text-white font-bold group">
            <ArrowLeft size={18} className="text-neon-blue group-hover:-translate-x-1 transition" /> 
            {lang === 'en' ? "Back" : "Volver"}
            </button>
        </Link>
      </nav>


      <nav className="fixed top-6 right-8 z-40">
        <button onClick={toggleLang} className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:border-neon-blue/50 transition flex items-center gap-2 text-xs font-bold tracking-widest text-white">
            {lang === 'en' ? "ES" : "EN"}
        </button>
      </nav>

      <header className="pt-32 pb-20 px-6 container mx-auto max-w-4xl text-center">
        <motion.h1 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-6xl font-black text-white mb-8"
        >
            {t.title}
        </motion.h1>

         <div className="flex flex-wrap justify-center gap-3 mb-10">
            {t.stack?.map((tech, i) => (
                <span key={i} className="text-xs font-mono text-neon-blue bg-neon-blue/5 border border-neon-blue/20 px-3 py-1 rounded-full">{tech}</span>
            ))}
        </div>

         <div className="flex justify-center gap-4">
             {t.links?.github && (
                <a 
                    href={t.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-neon-blue transition text-sm"
                >
                    <Github size={18}/> Code
                </a>
             )}
              {t.links?.demo && (
                <a 
                    href={t.links.demo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 text-white transition text-sm"
                >
                    <ExternalLink size={18}/> Live Demo
                </a>
             )}
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-5xl grid md:grid-cols-[2fr_1fr] gap-12">
        
        <div className="space-y-8">
            {t.images?.length > 0 ? (
                t.images.map((img, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                        className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group"
                    >
                        <img src={img} alt={`Screenshot ${i}`} loading="lazy" decoding="async" className="w-full h-auto group-hover:scale-105 transition duration-700" />
                    </motion.div>
                ))
            ) : (
                <div className="p-10 border border-white/10 rounded-3xl text-center text-gray-500">
                    {lang === 'en' ? "No images available" : "Sin imágenes disponibles"}
                </div>
            )}
        </div>

        <div className="space-y-12 md:sticky md:top-24 h-fit">
            <div>
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-neon-blue pl-4">
                    {lang === 'en' ? "About the Project" : "Sobre el Proyecto"}
                </h3>
                <p className="text-gray-400 leading-relaxed">{t.fullDesc}</p>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-neon-blue pl-4">
                    {lang === 'en' ? "Key Features" : "Funcionalidades Clave"}
                </h3>
                 <ul className="space-y-3">
                    {t.features?.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-400">
                            <span className="text-neon-blue mt-1">▹</span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;