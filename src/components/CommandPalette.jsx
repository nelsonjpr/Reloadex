import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CornerDownLeft, Search, Terminal } from 'lucide-react';
import { safeTop } from '../utils/safeArea';

const normalize = (text) => String(text || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const CommandPalette = ({ commands, onRun, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return commands;
    return commands.filter((command) => normalize(
      `${command.label} ${command.description} ${command.aliases.join(' ')}`,
    ).includes(q));
  }, [commands, query]);

  const run = (command) => {
    if (!command) return;
    setQuery('');
    onRun(command.text);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(results[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="mx-auto w-full max-w-xl px-4" style={{ ...safeTop(72) }}>
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-dark overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
            <Terminal size={17} className="shrink-0 text-rose-200" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un comando… (ej. cambio cara)"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-white/30 outline-none"
              aria-label="Comando"
            />
            <kbd className="rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-white/40">
              ESC
            </kbd>
          </div>

          <div className="max-h-[55vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center text-[13px] text-white/45">
                No hay comandos para «{query}».
              </p>
            ) : (
              results.map((command) => (
                <button
                  key={command.id}
                  type="button"
                  onClick={() => run(command)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.07]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-400/10 text-rose-200 ring-1 ring-rose-300/20">
                    <Search size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-white">{command.label}</span>
                    <span className="block truncate text-[11px] text-white/45">{command.description}</span>
                  </span>
                  <CornerDownLeft size={14} className="shrink-0 text-white/25" />
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommandPalette;
