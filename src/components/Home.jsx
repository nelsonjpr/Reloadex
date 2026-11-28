import React from 'react';
import { Search, Users, Zap, Sparkles, Crown, Map, MapPin, ScrollText, Smile, ChevronRight } from 'lucide-react';
import { APP_VERSION } from '../data/appInfo';
import { safeTop } from '../utils/safeArea';
import UpdateButton from './UpdateButton';

const Home = ({ onNavigate, onOpenPalette }) => {
  const menuItems = [
    {
      id: 'pokedex',
      title: 'POKÉDEX',
      description: 'BASE DE DATOS COMPLETA',
      icon: Search,
      color: '#DC143C'
    },
    {
      id: 'team',
      title: 'EQUIPO',
      description: 'CONSTRUYE TU EQUIPO',
      icon: Users,
      color: '#C0C0C0'
    },
    {
      id: 'moves',
      title: 'MOVIMIENTOS',
      description: 'MTs · MOs · DTs · TUTORES',
      icon: Zap,
      color: '#DC143C'
    },
    {
      id: 'abilities',
      title: 'HABILIDADES',
      description: 'CATÁLOGO COMPLETO',
      icon: Sparkles,
      color: '#808080'
    },
    {
      id: 'guia',
      title: 'GUÍA',
      description: 'RECORRIDO POR REGIONES',
      icon: Map,
      color: '#DC143C'
    },
    {
      id: 'misiones',
      title: 'MISIONES',
      description: '144 MISIONES ACTIVAS',
      icon: ScrollText,
      color: '#C0C0C0'
    },
    {
      id: 'caras',
      title: 'PERSONAJES',
      description: '361 SPRITES FACIALES',
      icon: Smile,
      color: '#DC143C'
    },
    {
      id: 'legendaries',
      title: 'LEGENDARIOS',
      description: 'CAPTURAS ESPECIALES',
      icon: Crown,
      color: '#808080'
    },
    {
      id: 'objetos',
      title: 'OBJETOS',
      description: 'LOCALIZACIÓN Y RUTAS',
      icon: MapPin,
      color: '#DC143C'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      {/* Header Cyberpunk */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--crimson-dark)' }}>
        {/* Líneas de fondo decorativas */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, var(--crimson) 0px, transparent 1px, transparent 20px)',
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, var(--crimson) 0px, transparent 1px, transparent 20px)',
          }} />
        </div>
        
        <div className="relative z-10 px-4 pb-8 sm:pb-12" style={safeTop(32)}>
          <div className="text-center">
            {/* Logo + Título */}
            <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
              <div className="relative tech-corner">
                <img
                  src="/logo-ui.png?v=2"
                  alt="Reloadex"
                  className="h-16 w-16 object-cover sm:h-24 sm:w-24"
                  style={{ 
                    clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                    boxShadow: '0 0 30px var(--crimson-glow), 0 10px 40px rgba(0, 0, 0, 0.9)',
                    border: '2px solid var(--crimson)'
                  }}
                />
              </div>
              <div className="text-left">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-[0.12em] text-white">
                  RELOADEX
                </h1>
                <div className="h-[2px] w-full mt-1 mb-1" style={{
                  background: 'linear-gradient(90deg, var(--crimson) 0%, transparent 100%)',
                  boxShadow: '0 0 10px var(--crimson-glow)'
                }} />
                <p className="eyebrow text-xs sm:text-sm">
                  SISTEMA POKÉDEX v{APP_VERSION}
                </p>
              </div>
            </div>
            
            <p className="text-xs sm:text-base font-medium tracking-[0.08em] uppercase" style={{ color: 'var(--silver)' }}>
              BASE DE DATOS · POKÉMON RELOADED
            </p>
          </div>
        </div>

        {/* Línea de escaneo animada */}
        <div className="scan-line absolute bottom-0 w-full h-[2px]" />
      </div>

      {/* Menu Grid - Estilo Paneles Tech */}
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="premium-card tech-corner group relative overflow-hidden p-6 text-left transition-all duration-200"
                style={{
                  borderColor: item.color === '#DC143C' ? 'var(--crimson-dark)' : 'var(--silver-dark)',
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Esquina cortada superior izquierda */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-[var(--app-bg)]" style={{
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                }} />
                
                {/* Esquina cortada inferior derecha */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[var(--app-bg)]" style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                }} />

                {/* Borde superior con glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
                  background: `linear-gradient(90deg, transparent 0%, ${item.color} 50%, transparent 100%)`,
                  opacity: 0.6
                }} />

                {/* Contenido */}
                <div className="relative z-10 flex items-start gap-4">
                  {/* Icono */}
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${item.color}1a`,
                      border: `1px solid ${item.color}`,
                      clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                      boxShadow: `0 0 20px ${item.color}40, inset 0 0 15px ${item.color}1a`
                    }}
                  >
                    <Icon size={28} style={{ color: item.color, filter: `drop-shadow(0 0 8px ${item.color}80)` }} />
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <h2 className="mb-2 text-lg sm:text-xl font-bold tracking-[0.1em] text-white" style={{
                      textShadow: `0 0 10px ${item.color}60`
                    }}>
                      {item.title}
                    </h2>
                    <p className="text-[10px] sm:text-xs font-semibold tracking-[0.12em] uppercase" style={{ 
                      color: 'var(--silver-dark)'
                    }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Flecha */}
                  <ChevronRight 
                    size={20} 
                    className="shrink-0 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
                    style={{ color: item.color }}
                  />
                </div>

                {/* Efecto hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${item.color}15 0%, transparent 70%)`,
                    boxShadow: `inset 0 0 40px ${item.color}20`
                  }}
                />

                {/* Línea inferior decorativa */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: `linear-gradient(90deg, transparent 0%, ${item.color} 50%, transparent 100%)`,
                  boxShadow: `0 0 10px ${item.color}80`
                }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Tech */}
      <div className="px-4 pb-8">
        <div className="app-card relative max-w-3xl mx-auto p-6 text-center">
          {/* Esquinas cortadas */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-[var(--app-bg)]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--app-bg)]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
          
          <p className="text-sm font-bold tracking-[0.12em] uppercase text-white mb-3">
            RELOADEX · POKÉDEX SYSTEM
          </p>
          <p className="text-xs font-medium tracking-[0.08em] uppercase mb-4" style={{ color: 'var(--silver-dark)' }}>
            POKÉMON RELOADED DATABASE
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="pill" style={{ 
              background: 'var(--crimson)',
              color: '#fff',
              boxShadow: '0 0 15px var(--crimson-glow)'
            }}>
              v{APP_VERSION}
            </span>
            <UpdateButton />
          </div>
          
          <div className="mt-4 h-[1px]" style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--crimson) 50%, transparent 100%)',
            opacity: 0.3
          }} />
          
          <p className="mt-4 text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--silver-dark)' }}>
            {new Date().getFullYear()} · SISTEMA ACTIVO · ENTRENADORES CONECTADOS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
