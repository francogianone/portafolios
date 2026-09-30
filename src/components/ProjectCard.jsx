import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Card de proyecto (contenido interno): carrusel de imágenes + título,
 * descripción y tags. Es agnóstica del contenedor: la usan el mazo 3D
 * (desktop) y el carrusel mobile por igual.
 */
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

            <div className="p-5 md:p-8">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-3">{project.title}</h4>
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

export default ProjectCard;