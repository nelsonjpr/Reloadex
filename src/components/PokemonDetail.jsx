import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Sparkles, ArrowLeft, ChevronDown,
  BarChart3, Layers, Ruler, Weight, Dna, Egg, TrendingUp,
  TrendingDown, Activity,
} from 'lucide-react';
import {
  typeColor, typeName, spriteUrl, spriteFallbacks,
  formatId, baseFormId, safeStats,
} from '../utils/sprites';
import { pokemonData } from '../data/pokemon';
import { abilityNameEs } from '../data/abilityNames.es';
import { effectivenessGroups, formatMultiplier } from '../data/typeChart';
import EvolutionTree, { normalizeLink } from './EvolutionTree';

// =============================================================
// Reloadex — ficha móvil moderna (datos reales de Pokémon Reloaded)
// =============================================================
const MAX_STAT = 255;
const DARK_BASE = '#080d1a';
const STAT_ORDER = [
  ['hp', 'PS'], ['attack', 'Ataque'], ['defense', 'Defensa'],
  ['spAttack', 'At. Esp.'], ['spDefense', 'Def. Esp.'], ['speed', 'Velocidad'],
];

const parseHex = (hex) => {
  const value = String(hex || '').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) return { r: 100, g: 116, b: 139 };
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};

// amount > 0 aclara, amount < 0 oscurece. Mantiene el color del tipo.
const adjustColor = (hex, amount) => {
  const { r, g, b } = parseHex(hex);
  const channel = (c) => {
    const next = amount < 0 ? c * (1 + amount) : c + (255 - c) * amount;
    return Math.round(Math.min(255, Math.max(0, next))).toString(16).padStart(2, '0');
  };
  return `#${channel(r)}${channel(g)}${channel(b)}`;
};

const readableText = (hex) => {
  const { r, g, b } = parseHex(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#0b1220' : '#ffffff';
};

const CRY_FILES = new Set(
  pokemonData.flatMap((p) => (p.sprite?.cryFile ? [String(p.sprite.cryFile)] : [])),
);

const cryCandidates = (p) => {
  const id = Number(p?.id);
  if (!Number.isFinite(id)) return [];
  const base = baseFormId(id);
  const ids = id >= 100000 ? [id, base] : [id];
  const names = p?.sprite?.cryFile ? [String(p.sprite.cryFile)] : [];
  for (const n of ids) {
    names.push(`${n}.wav`, `${String(n).padStart(3, '0')}.wav`);
  }
  return [...new Set(names)];
};

const canPlayCry = (p) => cryCandidates(p).some((name) => CRY_FILES.has(name));

const PokemonDetail = ({ pokemon, onClose, onNavigate }) => {
  const [isShiny, setIsShiny] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const id = Number(pokemon?.id);
  const types = Array.isArray(pokemon?.types) ? pokemon.types : [];
  const hasTypes = types.length > 0;
  const typeKey = types.join(',');
  const { weaknesses, resistances } = useMemo(
    () => (hasTypes ? effectivenessGroups(types) : { weaknesses: [], resistances: [] }),
    [typeKey, hasTypes],
  );
  const variants = Array.isArray(pokemon?.variants) ? pokemon.variants : [];

  if (!pokemon) return null;

  const primary = hasTypes ? typeColor(types[0]) : '#64748b';
  const secondary = hasTypes && types[1] ? typeColor(types[1]) : primary;
  const primaryLight = adjustColor(primary, 0.28);
  const primaryDark = adjustColor(secondary, -0.48);
  const stats = safeStats(pokemon);
  const hasStats = !!pokemon.stats && Object.values(pokemon.stats).some((v) => Number(v) > 0);
  const totalStats = Object.values(stats).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const generation = pokemon.generation
    ? String(pokemon.generation).replace(/^Gen\s*/i, 'Generación ')
    : null;

  const baseId = pokemon.baseForm ?? baseFormId(id);
  const basePokemon = pokemonData.find((p) => Number(p.id) === Number(baseId));
  const prevEvolution = normalizeLink(pokemon.prevEvolution)
    || (pokemon.form !== 'base' && basePokemon
      ? { id: basePokemon.id, name: basePokemon.name, method: null }
      : null);
  const evolutions = (Array.isArray(pokemon.evolutions) ? pokemon.evolutions : [])
    .map(normalizeLink)
    .filter(Boolean);
  const hasEvolutionLine = !!prevEvolution || evolutions.length > 0;

  const playSound = async () => {
    const urls = cryCandidates(pokemon).map((name) => `/cries/${name}`);
    for (const url of urls) {
      try {
        await new Audio(url).play();
        return;
      } catch {
        // Se prueba el siguiente nombre de archivo.
      }
    }
  };

  const navigateTo = (targetId) => {
    if (onNavigate) onNavigate(Number(targetId));
  };

  const abilities = Array.isArray(pokemon.abilities) ? pokemon.abilities : [];
  const moves = Array.isArray(pokemon.moves) ? pokemon.moves : [];
  const hasBreeding = !!(pokemon.eggGroups?.length || pokemon.eggSteps || pokemon.growthRate);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+24px)]"
    >
      <div className="mx-auto max-w-3xl sm:px-4 sm:pt-5">
        {/* Header con degradado del tipo principal y transición curva */}
        <motion.section
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(155deg, ${primaryLight} 0%, ${primary} 38%, ${secondary} 72%, ${primaryDark} 100%)`,
            minHeight: 420,
          }}
        >
          <div
            className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: primaryLight }}
          />
          <div className="pointer-events-none absolute -right-20 -top-10 h-80 w-80 rounded-full bg-white/25 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 22px 22px, white 2px, transparent 0)',
              backgroundSize: '44px 44px',
            }}
          />

          <div className="relative z-10 px-4 pb-20 pt-4 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                aria-label="Volver"
                className="pill flex h-11 w-11 items-center justify-center bg-black/25 text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-black/35 active:scale-95"
              >
                <ArrowLeft size={20} />
              </button>
              <span className="pill bg-black/25 px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums text-white/90 ring-1 ring-white/20">
                {formatId(id)}
              </span>
              <img
                src="/logo.png"
                alt="Reloadex"
                className="h-10 w-10 rounded-2xl bg-black/20 object-cover ring-1 ring-white/25"
              />
            </div>

            <div className="mt-1 flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute h-36 w-36 rounded-full opacity-45 blur-3xl"
                  style={{ backgroundColor: adjustColor(primary, 0.45) }}
                />
                <SpriteImage
                  id={id}
                  shiny={isShiny}
                  name={pokemon.name}
                  shinyFile={pokemon.sprite?.shinyFile}
                  glow={primary}
                  className="relative h-48 w-48 sm:h-56 sm:w-56"
                />
                {isShiny && (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 12 }}
                    className="absolute -right-2 top-1"
                  >
                    <Sparkles className="text-yellow-200 drop-shadow" size={32} />
                  </motion.div>
                )}
              </div>

              <h1 className="mt-2 text-[2rem] font-semibold leading-tight tracking-[-0.04em] text-white text-shadow sm:text-5xl">
                {pokemon.name}
              </h1>

              {(pokemon.form === 'mega' || pokemon.form === 'forme') && (
                <span className="pill mt-1.5 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">
                  {pokemon.formLabel || (pokemon.form === 'mega' ? 'Mega evolución' : 'Forma')}
                  {basePokemon ? ` · ${basePokemon.name}` : ''}
                </span>
              )}

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {hasTypes ? types.map((type) => {
                  const color = typeColor(type);
                  return (
                    <span
                      key={type}
                      className="pill px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/25"
                      style={{
                        background: `linear-gradient(135deg, ${adjustColor(color, 0.16)}, ${color})`,
                        color: readableText(color),
                        boxShadow: `0 12px 26px -12px ${color}bb, inset 0 1px 0 rgba(255,255,255,0.18)`,
                      }}
                    >
                      {typeName(type)}
                    </span>
                  );
                }) : (
                  <span className="pill bg-black/25 px-4 py-1.5 text-xs font-bold text-white/85 ring-1 ring-white/20">
                    —
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                {canPlayCry(pokemon) && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={playSound}
                    className="pill flex min-h-[46px] items-center gap-2 px-6 text-sm text-white ring-1 ring-white/25"
                    style={{
                      background: `linear-gradient(135deg, ${adjustColor(primary, 0.2)}, ${adjustColor(primary, -0.22)})`,
                      boxShadow: `0 10px 24px ${primary}55`,
                    }}
                  >
                    <Volume2 size={18} />
                    <span>Grito</span>
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsShiny((v) => !v)}
                  className="pill flex min-h-[46px] items-center gap-2 px-6 text-sm text-slate-900 ring-1 ring-white/40"
                  style={{
                    background: 'linear-gradient(135deg, #fde68a 0%, #f9a8d4 55%, #f472b6 100%)',
                    boxShadow: '0 10px 24px rgba(244, 114, 182, 0.35)',
                  }}
                >
                  <Sparkles size={18} />
                  <span>{isShiny ? 'Normal' : 'Shiny'}</span>
                </motion.button>
              </div>
            </div>
          </div>

          <svg
            className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-10 h-14 w-full"
            viewBox="0 0 400 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,60 L0,28 Q200,-4 400,28 L400,60 Z" fill={DARK_BASE} />
          </svg>
        </motion.section>

        {/* Tarjetas flotantes sobre el fondo oscuro */}
        <div className="relative z-20 -mt-4 space-y-4 px-4 pb-6 sm:px-0">
          <Card>
            <SectionTitle icon={Dna} color={primary}>Ficha</SectionTitle>
            {pokemon.description && (
              <p className="mt-4 text-sm leading-7 text-white/75 sm:text-[15px]">
                {pokemon.description}
              </p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <Info icon={Ruler} label="Altura" value={pokemon.height != null ? `${pokemon.height} m` : '—'} color={primary} />
              <Info icon={Weight} label="Peso" value={pokemon.weight != null ? `${pokemon.weight} kg` : '—'} color={primary} />
              {pokemon.species && <Info icon={Dna} label="Categoría" value={pokemon.species} color={primary} />}
              {generation && <Info label="Generación" value={generation} />}
              {pokemon.region && <Info label="Región" value={pokemon.region} />}
            </div>

            {abilities.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">Habilidades</h4>
                <div className="flex flex-wrap gap-2">
                  {abilities.map((ability, i) => {
                    const name = typeof ability === 'object' ? ability.name : ability;
                    const hidden = typeof ability === 'object' && !!ability.hidden;
                    return (
                      <span
                        key={`${name}-${i}`}
                        className="pill inline-flex items-center gap-2 border px-3.5 py-2 text-[13px] text-white"
                        style={{ background: `${primary}1f`, borderColor: `${primary}66` }}
                      >
                        {abilityNameEs(name)}
                        {hidden && (
                          <span className="pill bg-gradient-to-r from-amber-300 to-pink-400 px-2 py-0.5 text-[10px] font-extrabold text-slate-900">
                            Oculta
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {moves.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">Movimientos</h4>
                <div className="flex flex-wrap gap-2">
                  {moves.slice(0, 16).map((move, i) => (
                    <span
                      key={`${moveLabel(move)}-${i}`}
                      className="pill border px-3 py-1.5 text-xs font-semibold text-white/85"
                      style={{ background: 'rgba(255,255,255,0.05)', borderColor: `${primary}44` }}
                    >
                      {moveLabel(move)}
                    </span>
                  ))}
                  {moves.length > 16 && (
                    <span className="pill bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/60">
                      +{moves.length - 16}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Estadisticas */}
          {hasStats && (
            <Card>
              <SectionTitle icon={BarChart3} color={primary}>Estadisticas</SectionTitle>
              <div
                className="mt-4 flex items-center justify-between rounded-3xl border px-4 py-3.5"
                style={{ background: `${primary}16`, borderColor: `${primary}44` }}
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/55">Total</div>
                  <div className="text-[11px] text-white/40">Suma de estadísticas base</div>
                </div>
                <span className="text-3xl font-semibold tracking-[-0.04em] tabular-nums" style={{ color: primary }}>
                  {totalStats}
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {STAT_ORDER.map(([key, label]) => {
                  const value = stats[key] || 0;
                  const pct = Math.min(100, (value / MAX_STAT) * 100);
                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-white/75">{label}</span>
                        <span className="text-sm font-semibold tabular-nums" style={{ color: primary }}>{value}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.55, delay: 0.08 }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${primary}, ${adjustColor(primary, 0.3)})`,
                            boxShadow: `0 0 14px ${primary}88`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Fortalezas y debilidades */}
          {hasTypes && (
            <Card>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <SectionTitle icon={TrendingUp} color={primary}>Debilidades</SectionTitle>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {weaknesses.map(([type, multiplier]) => (
                      <MultiplierChip key={type} type={type} multiplier={multiplier} />
                    ))}
                  </div>
                </div>
                <div>
                  <SectionTitle icon={TrendingDown} color={primary}>Fortalezas</SectionTitle>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resistances.map(([type, multiplier]) => (
                      <MultiplierChip key={type} type={type} multiplier={multiplier} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Cría y crecimiento (solo si el juego/registro los contiene) */}
          {hasBreeding && (
            <Card>
              <SectionTitle icon={Egg} color={primary}>Cría y crecimiento</SectionTitle>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {pokemon.eggGroups?.length > 0 && (
                  <Info label="Grupos huevo" value={pokemon.eggGroups.map(eggName).join(', ')} />
                )}
                {pokemon.eggSteps && <Info label="Pasos de eclosión" value={String(pokemon.eggSteps)} />}
                {pokemon.growthRate && <Info label="Crecimiento" value={growthName(pokemon.growthRate)} />}
              </div>
            </Card>
          )}

          {/* Variantes y línea evolutiva */}
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <SectionTitle icon={Layers} color={primary}>Formas</SectionTitle>
              {variants.length > 0 && (
                <button
                  onClick={() => setShowVariants((v) => !v)}
                  aria-expanded={showVariants}
                  className="pill flex min-h-[40px] items-center gap-2 border px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  style={{ background: `${primary}1f`, borderColor: `${primary}55` }}
                >
                  Variantes
                  <motion.span animate={{ rotate: showVariants ? 180 : 0 }} className="inline-flex">
                    <ChevronDown size={16} />
                  </motion.span>
                </button>
              )}
            </div>

            <AnimatePresence initial={false}>
              {showVariants && variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 pb-5 sm:grid-cols-3">
                    {variants.map((variant) => (
                      <VariantCard
                        key={variant.id}
                        variant={variant}
                        active={Number(variant.id) === id}
                        color={primary}
                        onClick={() => navigateTo(variant.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-white/10 pt-5">
              <SectionTitle icon={Activity} color={primary}>Línea evolutiva</SectionTitle>
              <div className="pt-4">
                {hasEvolutionLine ? (
                  <EvolutionTree
                    pokemon={pokemon}
                    prevEvolution={prevEvolution}
                    onNavigate={navigateTo}
                  />
                ) : (
                  pokemon.evolutionKnown && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 py-8 text-center text-sm text-white/60">
                      Este Pokémon no evoluciona
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

const moveLabel = (move) => (typeof move === 'object' ? (move.name || move.id || '—') : String(move));
const eggName = (group) => (typeof group === 'object' ? (group.name || '—') : String(group));
const growthName = (rate) => ({
  slow: 'Lenta', medium: 'Media', 'medium-slow': 'Media lenta', fast: 'Rápida',
  erratic: 'Errática', fluctuating: 'Fluctuante',
}[String(rate).toLowerCase()] || String(rate));

function Card({ children, className = '' }) {
  return <div className={`app-card rounded-[28px] p-5 sm:p-6 ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon, children, color = '#7dd3fc' }) {
  return (
    <div className="flex items-center gap-2.5">
      {Icon && (
        <span
          className="flex h-9 w-9 items-center justify-center rounded-2xl ring-1 ring-white/10"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${color}55 0%, ${color}22 52%, ${color}0d 100%)`,
            color,
            boxShadow: `0 10px 22px -12px ${color}aa`,
          }}
        >
          <Icon size={18} />
        </span>
      )}
      <h3 className="text-base font-semibold tracking-[-0.03em] text-white sm:text-lg">{children}</h3>
    </div>
  );
}

function Info({ icon: Icon, label, value, color }) {
  return (
    <div
      className="premium-card rounded-2xl border border-white/10 bg-white/[0.045] p-3.5"
      style={{ '--card-shadow': '0 14px 30px -18px rgba(3, 10, 26, 0.85)' }}
    >
      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
        {Icon && <Icon size={14} style={{ color: color || undefined }} />}
        <span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-normal tracking-[0.01em] sm:text-base" style={{ color: color || undefined }}>
        {value ?? '—'}
      </div>
    </div>
  );
}

function MultiplierChip({ type, multiplier }) {
  const color = typeColor(type);
  return (
    <span
      className="pill inline-flex items-center gap-2 border px-3 py-1.5 text-xs text-white"
      style={{ background: `${color}33`, borderColor: `${color}aa` }}
    >
      <span>{typeName(type)}</span>
      <span className="rounded-full bg-black/35 px-2 py-0.5 font-semibold tabular-nums">
        {formatMultiplier(multiplier)}
      </span>
    </span>
  );
}

function VariantCard({ variant, active, color, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -4, transition: { duration: 0.3, delay: 0 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.18, delay: 0 } }}
      onClick={onClick}
      className="premium-card rounded-2xl border p-3 text-left"
      style={{
        borderColor: active ? color : 'rgba(255,255,255,0.12)',
        background: active ? `${color}26` : 'rgba(255,255,255,0.04)',
        '--card-shadow': active
          ? `0 16px 34px -18px ${color}bb`
          : '0 14px 30px -18px rgba(3, 10, 26, 0.85)',
        '--card-shadow-hover': active
          ? `0 22px 44px -18px ${color}dd`
          : `0 20px 40px -18px ${color}66`,
      }}
    >
      <div className="truncate text-sm font-semibold tracking-[-0.02em] text-white">{variant.name}</div>
      <div className="mt-1 text-[11px] font-normal tracking-[0.05em] text-white/60">{variant.label || 'Forma'}</div>
      {variant.method && variant.method !== variant.label && (
        <div className="mt-0.5 text-[11px] font-normal text-white/45">{variant.method}</div>
      )}
    </motion.button>
  );
}

function SpriteImage({ id, shiny = false, name, className = '', small = false, shinyFile = null, glow = null }) {
  const [src, setSrc] = useState(() => spriteUrl(id, shiny, shinyFile));
  React.useEffect(() => { setSrc(spriteUrl(id, shiny, shinyFile)); }, [id, shiny, shinyFile]);
  const fallbacks = spriteFallbacks(id, shiny, shinyFile);
  const spriteFilter = glow
    ? `drop-shadow(0 14px 18px rgba(2, 6, 18, 0.5)) drop-shadow(0 0 14px ${glow}66)`
    : 'drop-shadow(0 14px 18px rgba(2, 6, 18, 0.5))';
  return (
    <img
      key={`${id}-${shiny}-${shinyFile || ''}`}
      src={src}
      alt={name}
      className={`object-contain pixelated ${className}`}
      style={{ filter: spriteFilter }}
      onError={(e) => {
        const next = fallbacks.find((f) => !e.target.src.endsWith(f.split('/').pop()));
        if (next && !e.target.dataset.tried) {
          e.target.dataset.tried = '1';
          e.target.src = next;
        } else {
          e.target.style.visibility = 'hidden';
        }
      }}
    />
  );
}

export default PokemonDetail;
