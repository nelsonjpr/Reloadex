import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Award, Lightbulb, ChevronDown, Search } from 'lucide-react';
import { legendaries } from '../data/legendaries';
import { typeColors } from '../data/pokemon';

const LegendariesView = ({ onBack }) => {
  const [selectedLegendary, setSelectedLegendary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = legendaries.filter(leg => 
    leg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leg.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              Pokémon Legendarios
            </h1>
            <p className="text-white/60">Ubicaciones y guías de captura</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Buscar legendario o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 rounded-2xl glass-dark text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Count */}
        <div className="text-center mb-8">
          <span className="glass-dark px-6 py-3 rounded-full text-sm font-semibold inline-block">
            <span className="text-white/60">Mostrando </span>
            <span className="text-amber-400 font-bold">{filtered.length}</span>
            <span className="text-white/60"> de {legendaries.length} legendarios</span>
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((legendary, index) => (
            <motion.div
              key={legendary.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-dark rounded-3xl overflow-hidden hover:ring-2 hover:ring-amber-500/50 transition-all cursor-pointer group"
              onClick={() => setSelectedLegendary(legendary)}
            >
              {/* Card Header */}
              <div
                className="relative h-48 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${typeColors[legendary.types[0]]} 0%, ${typeColors[legendary.types[1] || legendary.types[0]]} 100%)`
                }}
              >
                {/* Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                {/* Sprite */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.img
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    src={`/sprites/normal/${legendary.id}.gif`}
                    alt={legendary.name}
                    className="w-32 h-32 object-contain pixelated drop-shadow-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Level Badge */}
                <div className="absolute top-3 right-3 glass-effect px-3 py-1 rounded-full text-xs font-bold text-white">
                  Nv. {legendary.level}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-2">{legendary.name}</h3>

                {/* Types */}
                <div className="flex gap-2 mb-3">
                  {legendary.types.map(type => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase"
                      style={{ backgroundColor: typeColors[type] }}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-sm mb-3">
                  <MapPin size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{legendary.location}</span>
                </div>

                {/* Quick Info */}
                <div className="glass-effect rounded-xl p-3 text-xs text-white/70">
                  {legendary.description.substring(0, 80)}...
                </div>

                {/* CTA */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-amber-400 font-semibold group-hover:text-amber-300 transition-colors">
                    Toca para ver guía completa →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-white/60">No se encontraron legendarios</div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLegendary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLegendary(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl shadow-2xl"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Modal Header */}
              <div
                className="relative h-64 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${typeColors[selectedLegendary.types[0]]} 0%, ${typeColors[selectedLegendary.types[1] || selectedLegendary.types[0]]} 100%)`
                }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                <button
                  onClick={() => setSelectedLegendary(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                  <img
                    src={`/sprites/normal/${selectedLegendary.id}.gif`}
                    alt={selectedLegendary.name}
                    className="w-40 h-40 object-contain pixelated drop-shadow-2xl mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedLegendary.name}</h2>
                  <div className="flex gap-2">
                    {selectedLegendary.types.map(type => (
                      <span
                        key={type}
                        className="px-4 py-2 rounded-full text-sm font-bold text-white uppercase bg-black/30 backdrop-blur-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div className="glass-dark rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={20} className="text-amber-400" />
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wide">
                      Descripción
                    </h3>
                  </div>
                  <p className="text-white/90 leading-relaxed">{selectedLegendary.description}</p>
                </div>

                {/* Location */}
                <div className="glass-dark rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={20} className="text-purple-400" />
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wide">
                      Ubicación
                    </h3>
                  </div>
                  <div className="text-lg font-semibold text-white mb-2">{selectedLegendary.location}</div>
                  <div className="text-sm text-white/70">Nivel: {selectedLegendary.level}</div>
                </div>

                {/* Requirements */}
                <div className="glass-dark rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={20} className="text-green-400" />
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wide">
                      Requisitos
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {selectedLegendary.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="glass-dark rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={20} className="text-yellow-400" />
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wide">
                      Consejos de Captura
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {selectedLegendary.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedLegendary(null)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LegendariesView;
