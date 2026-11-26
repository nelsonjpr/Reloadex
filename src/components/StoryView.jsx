import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  MapPin, 
  Target, 
  Lightbulb, 
  Trophy, 
  TrendingUp,
  Sword,
  Star,
  Map,
  ArrowLeft
} from 'lucide-react';
import { storyGuide, importantLocations, importantItems } from '../data/story';

export function StoryView({ onBack }) {
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [activeTab, setActiveTab] = useState('chapters'); // chapters, locations, items

  const toggleChapter = (id) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 pb-20">
      {/* Botón Volver */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 glass-effect px-4 py-2 rounded-xl text-white hover:glass-hover transition-all mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Guía de Historia
        </h1>
        <p className="text-gray-400">Completa tu aventura en Pokémon Reloaded</p>
      </motion.div>

      {/* Tabs */}
      <div className="glass-effect rounded-2xl p-1 mb-6 flex gap-1">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'chapters'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Map className="w-5 h-5" />
            Capítulos
          </div>
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'locations'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            Ubicaciones
          </div>
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'items'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5" />
            Objetos
          </div>
        </button>
      </div>

      {/* Chapters Tab */}
      {activeTab === 'chapters' && (
        <div className="space-y-3">
          {storyGuide.map((chapter) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapter.id * 0.05 }}
            >
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full glass-effect hover:glass-hover rounded-2xl p-4 text-left transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-purple-400">
                        {chapter.chapter}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                        Nv. {chapter.recommendedLevel}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      {chapter.location}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedChapter === chapter.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {expandedChapter === chapter.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-dark rounded-2xl p-4 mt-2 space-y-4">
                      {/* Objectives */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-blue-400" />
                          <h4 className="font-semibold text-white">Objetivos</h4>
                        </div>
                        <ul className="space-y-1">
                          {chapter.objectives.map((obj, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-yellow-400" />
                          <h4 className="font-semibold text-white">Consejos</h4>
                        </div>
                        <ul className="space-y-1">
                          {chapter.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">💡</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Rewards */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-5 h-5 text-green-400" />
                          <h4 className="font-semibold text-white">Recompensas</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {chapter.rewards.map((reward, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                            >
                              {reward}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Gym Leader / Elite Four */}
                      {chapter.gymLeader && (
                        <div className="glass-effect rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Sword className="w-5 h-5 text-red-400" />
                            <h4 className="font-semibold text-white">Líder de Gimnasio</h4>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">
                            <span className="font-semibold text-white">{chapter.gymLeader.name}</span>
                            {' - '}
                            <span className="text-purple-400">Tipo {chapter.gymLeader.type}</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {chapter.gymLeader.team.map((pokemon, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs"
                              >
                                {pokemon}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Elite Four */}
                      {chapter.eliteFour && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Sword className="w-5 h-5 text-red-400" />
                            <h4 className="font-semibold text-white">Alto Mando</h4>
                          </div>
                          {chapter.eliteFour.map((member, i) => (
                            <div key={i} className="glass-effect rounded-xl p-3">
                              <p className="text-sm text-gray-300 mb-2">
                                <span className="font-semibold text-white">{member.name}</span>
                                {' - '}
                                <span className="text-purple-400">Tipo {member.type}</span>
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {member.team.map((pokemon, j) => (
                                  <span
                                    key={j}
                                    className="px-2 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs"
                                  >
                                    {pokemon}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Champion */}
                      {chapter.champion && (
                        <div className="glass-effect rounded-xl p-3 border-2 border-yellow-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <h4 className="font-semibold text-white">Campeón</h4>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">
                            <span className="font-semibold text-yellow-400">{chapter.champion.name}</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {chapter.champion.team.map((pokemon, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs"
                              >
                                {pokemon}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="space-y-3">
          {importantLocations.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{location.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{location.description}</p>
                  
                  {location.pokemon.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-400 mb-1">Pokémon disponibles:</p>
                      <div className="flex flex-wrap gap-2">
                        {location.pokemon.map((poke, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs"
                          >
                            {poke}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Requisitos:</p>
                    <div className="flex flex-wrap gap-2">
                      {location.requirements.map((req, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-green-500/20 text-green-300 rounded-lg text-xs"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-2">
          <div className="glass-dark rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Objetos Importantes</h3>
            </div>
            <p className="text-sm text-gray-400">
              Objetos esenciales para progresar en tu aventura
            </p>
          </div>

          {importantItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">{item.name}</span>
                  {item.required && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-xs">
                      Requerido
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
