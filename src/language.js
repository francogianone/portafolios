/**
 * Persistencia del idioma del portafolio.
 * App y ProjectDetails nunca están montados a la vez (rutas separadas),
 * así que con localStorage alcanza para que el idioma se mantenga
 * entre páginas y entre sesiones.
 */
export const LANG_KEY = 'portfolio-lang';

export const getInitialLang = () => {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
};

export const saveLang = (lang) => {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* localStorage no disponible (modo privado): se ignora */
  }
};
