import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';

import erpMain from '../assets/erp-stock.png';
import erpOrders from '../assets/erp-ordenes.png';
import erpAfip from '../assets/erp-factura.png';
import erpDash from '../assets/erp-dashboard.png';

import ecomMain from '../assets/ecom-home.png';
import ecomCart from '../assets/ecom-cart.png';
import ecomDetail from '../assets/ecom-detail.png';

import landHero from '../assets/landing-hero.png';
import landAbout from '../assets/landing-feature.png';
import land from '../assets/landing-mobile.png';

import javaInicio from '../assets/java-inicio.png';
import javaHist from '../assets/java-historial.png';
import javaGest from '../assets/java-gestion.png';
import javaProd from '../assets/java-productos.png';
import javaUbi from '../assets/java-ubicaciones.png';
const projectsExtendedData = {
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
    images: [
        ecomMain,
        ecomCart,
        ecomDetail


    ],
     links: { github: "https://github.com/francogianone/e-commerce", demo: "https://e-commerce-rosy-seven-88.vercel.app/" }
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
    images: [
        landHero,
        landAbout,
        land
    ],
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
    stack: ["React", "Electron", "Node.js (Express)", "MySQL", "AFIP Web Services", "Mercado Pago API", "Google Drive API"],    images: [

        erpMain,  
        erpDash,
        erpOrders,  
        erpAfip
    ],
     links: { github: "https://github.com/francogianone/sistema-gestion-grafica/", demo: "https://sistema-gestion-grafica.vercel.app/" }
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
    images: [
        javaInicio,
        javaHist,
        javaGest,
        javaProd,
        javaUbi  
    ],
     links: { 
        github: "https://github.com/francogianone/sistema-wms-java", 
        
        demo:  "https://www.youtube.com/watch?v=5_aNNMltbLM"
     }
  },
};


const ProjectDetails = () => {
  const { id } = useParams();
  const project = projectsExtendedData[id] || { 
      title: "Proyecto no encontrado", 
      fullDesc: "El proyecto que buscas no existe o ha sido movido.", 
      images: [], features: [], stack: [] 
  };

  return (
    <div className="bg-dark text-gray-200 min-h-screen font-sans selection:bg-neon-blue selection:text-black pb-20">
      
      <nav className="fixed top-6 left-8 z-40">
        <Link to="/">
            <button className="backdrop-blur-md bg-black/50 border border-white/10 px-4 py-2 rounded-full hover:border-neon-blue/50 transition flex items-center gap-2 text-sm text-white font-bold group">
            <ArrowLeft size={18} className="text-neon-blue group-hover:-translate-x-1 transition" /> Volver
            </button>
        </Link>
      </nav>

      <header className="pt-32 pb-20 px-6 container mx-auto max-w-4xl text-center">
        <motion.h1 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-6xl font-black text-white mb-8"
        >
            {project.title}
        </motion.h1>

         <div className="flex flex-wrap justify-center gap-3 mb-10">
            {project.stack?.map((tech, i) => (
                <span key={i} className="text-xs font-mono text-neon-blue bg-neon-blue/5 border border-neon-blue/20 px-3 py-1 rounded-full">{tech}</span>
            ))}
        </div>

         <div className="flex justify-center gap-4">
             {project.links?.github && (
                <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-neon-blue transition text-sm"
                >
                    <Github size={18}/> Code
                </a>
             )}
              {project.links?.demo && (
                <a 
                    href={project.links.demo} 
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
            {project.images?.length > 0 ? (
                project.images.map((img, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                        className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group"
                    >
                        <img src={img} alt={`Screenshot ${i}`} className="w-full h-auto group-hover:scale-105 transition duration-700" />
                    </motion.div>
                ))
            ) : (
                <div className="p-10 border border-white/10 rounded-3xl text-center text-gray-500">Sin imágenes disponibles</div>
            )}
        </div>

        <div className="space-y-12 md:sticky md:top-24 h-fit">
            <div>
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-neon-blue pl-4">Sobre el Proyecto</h3>
                <p className="text-gray-400 leading-relaxed">{project.fullDesc}</p>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-neon-blue pl-4">Funcionalidades Clave</h3>
                 <ul className="space-y-3">
                    {project.features?.map((feature, i) => (
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