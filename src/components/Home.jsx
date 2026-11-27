import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Zap, Sparkles, Crown, Map } from 'lucide-react';
import { APP_VERSION } from '../data/appInfo';

const Home = ({ onNavigate }) => {
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
      id: 'legendaries',
      title: 'Legendarios',
      description: 'Ubicaciones y capturas',
      icon: Crown,
      gradient: 'from-amber-500 to-yellow-500',
      bgPattern: 'bg-amber-500/10',
      accent: '#fcd34d'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080d1a]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="relative z-10 px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.25, delay: 0 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.15, delay: 0 } }}
                onClick={() => onNavigate(item.id)}
                className="premium-card group relative overflow-hidden rounded-2xl border border-white/[0.06] sm:rounded-3xl p-4 text-left sm:p-6"
                style={{
                  '--card-shadow': `0 18px 44px -22px ${item.accent}66, 0 12px 30px -18px rgba(3, 8, 20, 0.85)`,
                  '--card-shadow-hover': `0 26px 58px -20px ${item.accent}99, 0 16px 34px -16px rgba(3, 8, 20, 0.9)`,
                }}
              >
                {/* Background con glass effect */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
                <div className={`absolute inset-0 ${item.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
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
              </motion.button>
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
            <span>{new Date().getFullYear()} · Hecho con ❤️ para entrenadores</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
