import React from 'react';
import { Search, Users, Zap, Sparkles, Crown, Map, MapPin, ScrollText, Smile, Terminal } from 'lucide-react';
import { APP_VERSION } from '../data/appInfo';
import { safeTop } from '../utils/safeArea';
import UpdateButton from './UpdateButton';

const Home = ({ onNavigate, onOpenPalette }) => {
  const menuItems = [
    {
      id: 'pokedex',
      title: 'Pokédex',
      description: 'Explora todos los Pokémon',
      icon: Search,
      gradient: 'from-blue-500 to-cyan-500',
      bgPattern: 'bg-blue-500/10',
      accent: '#38bdf8'
    },
    {
      id: 'team',
      title: 'Equipo',
      description: 'Crea tu equipo perfecto',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      bgPattern: 'bg-purple-500/10',
      accent: '#c084fc'
    },
    {
      id: 'moves',
      title: 'Movimientos',
      description: 'MTs, MOs, DTs y Tutores',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-500',
      bgPattern: 'bg-yellow-500/10',
      accent: '#fbbf24'
    },
    {
      id: 'abilities',
      title: 'Habilidades',
      description: 'Todas las habilidades',
      icon: Sparkles,
      gradient: 'from-green-500 to-emerald-500',
      bgPattern: 'bg-green-500/10',
      accent: '#34d399'
    },
    {
      id: 'guia',
      title: 'Guía',
      description: 'Recorrido completo por regiones',
      icon: Map,
      gradient: 'from-teal-500 to-emerald-500',
      bgPattern: 'bg-teal-500/10',
      accent: '#2dd4bf'
    },
    {
      id: 'misiones',
      title: 'Misiones',
      description: 'Las 144 misiones del juego',
      icon: ScrollText,
      gradient: 'from-fuchsia-500 to-violet-500',
      bgPattern: 'bg-fuchsia-500/10',
      accent: '#e879f9'
    },
    {
      id: 'caras',
      title: 'Caras',
      description: '361 personajes y sus sprites',
      icon: Smile,
      gradient: 'from-rose-500 to-orange-500',
      bgPattern: 'bg-rose-500/10',
      accent: '#fb7185'
    },
    {
      id: 'legendaries',
      title: 'Legendarios',
      description: 'Ubicaciones y capturas',
      icon: Crown,
      gradient: 'from-amber-500 to-yellow-500',
      bgPattern: 'bg-amber-500/10',
      accent: '#fcd34d'
    },
    {
      id: 'objetos',
      title: 'Localización de objetos',
      description: 'Todos los objetos y sus rutas',
      icon: MapPin,
      gradient: 'from-indigo-500 to-blue-500',
      bgPattern: 'bg-indigo-500/10',
      accent: '#818cf8'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080d1a]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="relative z-10 px-4 pb-8 sm:pb-12" style={safeTop(32)}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <img
                src="/logo-ui.png"
                alt="Reloadex"
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/20 sm:h-20 sm:w-20"
                style={{ boxShadow: '0 18px 38px -18px rgba(56, 189, 248, 0.8), inset 0 1px 0 rgba(255,255,255,0.2)' }}
              />
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] text-white">
                <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Reloadex</span>
              </h1>
            </div>
            <p className="text-sm sm:text-lg font-normal tracking-[0.01em] text-white/70">
              Tu Pokédex definitiva de <span className="font-semibold text-white">Pokémon Reloaded</span>
            </p>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 pb-12 max-w-6xl mx-auto">
        <button
          type="button"
          onClick={onOpenPalette}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[11px] font-semibold tracking-[0.02em] text-white/55 transition hover:border-rose-300/20 hover:text-white/85"
        >
          <Terminal size={14} className="text-rose-200/80" />
          Comandos: pulsa <kbd className="rounded border border-white/10 bg-black/30 px-1 font-mono text-[10px]">Ctrl+K</kbd> o <kbd className="rounded border border-white/10 bg-black/30 px-1 font-mono text-[10px]">/</kbd> y escribe <span className="font-mono text-rose-200/90">cambio cara</span>
        </button>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="premium-card group relative overflow-hidden rounded-2xl border border-white/[0.06] p-4 text-left active:scale-[0.98] sm:rounded-3xl sm:p-6"
                style={{
                  '--card-shadow': `0 18px 44px -22px ${item.accent}66, 0 12px 30px -18px rgba(3, 8, 20, 0.85)`,
                  '--card-shadow-hover': `0 26px 58px -20px ${item.accent}99, 0 16px 34px -16px rgba(3, 8, 20, 0.9)`,
                }}
              >
                {/* Sin backdrop-blur: la tarjeta ya es opaca y evitar capas de
                    desenfoque mejora mucho el scroll en móvil. */}
                <div className={`absolute inset-0 ${item.bgPattern} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                
                {/* Patrón decorativo */}
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {/* Contenido */}
                <div className="relative z-10">
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-16 sm:w-16 sm:rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 30% 24%, ${item.accent}f2 0%, ${item.accent}99 42%, ${item.accent}1f 100%)`,
                      boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.2), 0 12px 26px -12px ${item.accent}aa`,
                    }}
                  >
                    <Icon size={24} className="text-white sm:h-8 sm:w-8" />
                  </div>
                  <h2 className="mb-1 text-lg font-semibold tracking-[-0.03em] text-white sm:mb-2 sm:text-2xl">
                    {item.title}
                  </h2>
                  <p className="text-xs font-normal tracking-[0.01em] text-white/60 sm:text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Brillo en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-4 pb-8 text-center">
        <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-sm font-normal tracking-[0.01em] text-white/60">
            <span className="font-semibold text-white">Reloadex</span> · Pokédex de Pokémon Reloaded
          </p>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-normal tracking-[0.06em] text-white/40">
            <span className="pill bg-white/10 px-2 py-0.5 font-semibold tracking-normal text-white/75">
              Versión {APP_VERSION}
            </span>
            <UpdateButton />
            <span>{new Date().getFullYear()} · Hecho con ❤️ para entrenadores</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
