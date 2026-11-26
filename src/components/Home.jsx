import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Zap, Sparkles, BookOpen, Crown } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const menuItems = [
    {
      id: 'pokedex',
      title: 'Pokédex',
      description: 'Explora todos los Pokémon',
      icon: Search,
      gradient: 'from-blue-500 to-cyan-500',
      bgPattern: 'bg-blue-500/10'
    },
    {
      id: 'team',
      title: 'Equipo',
      description: 'Crea tu equipo perfecto',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      bgPattern: 'bg-purple-500/10'
    },
    {
      id: 'moves',
      title: 'Movimientos',
      description: 'MTs, MOs, DTs y Tutores',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-500',
      bgPattern: 'bg-yellow-500/10'
    },
    {
      id: 'abilities',
      title: 'Habilidades',
      description: 'Todas las habilidades',
      icon: Sparkles,
      gradient: 'from-green-500 to-emerald-500',
      bgPattern: 'bg-green-500/10'
    },
    {
      id: 'story',
      title: 'Historia',
      description: 'Guía de la historia principal',
      icon: BookOpen,
      gradient: 'from-red-500 to-rose-500',
      bgPattern: 'bg-red-500/10'
    },
    {
      id: 'legendaries',
      title: 'Legendarios',
      description: 'Ubicaciones y capturas',
      icon: Crown,
      gradient: 'from-amber-500 to-yellow-500',
      bgPattern: 'bg-amber-500/10'
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
              <img src="/logo.png" alt="Reloadex" className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-white/15 shadow-xl" />
              <h1 className="text-3xl sm:text-5xl font-bold text-white">
                <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Reloadex</span>
              </h1>
            </div>
            <p className="text-sm sm:text-lg text-white/70">
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(item.id)}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left"
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
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                    {item.title}
                  </h2>
                  <p className="text-white/60 text-xs sm:text-sm line-clamp-2">
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
          <p className="text-white/60 text-sm">
            <span className="font-semibold text-white">Reloadex</span> · Pokédex de Pokémon Reloaded
          </p>
          <p className="text-white/40 text-xs mt-2">
            {new Date().getFullYear()} - Hecho con ❤️ para entrenadores
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
