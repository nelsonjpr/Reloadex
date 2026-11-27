import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Download, RefreshCw, X } from 'lucide-react';
import { applyUpdate, checkForUpdate, getNativeInfo } from '../utils/updater';

const LABELS = {
  checking: 'Comprobando…',
  available: 'Actualizar ahora',
  uptodate: 'Actualizado',
  working: 'Actualizando…',
  error: 'Reintentar',
};

const mb = (bytes) => {
  if (!bytes || bytes <= 0) return '—';
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
};

const UpdateButton = () => {
  const [state, setState] = useState('checking');
  const [info, setInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState({ downloaded: 0, total: 0 });
  const resultRef = useRef(null);

  // El modal se monta con un portal sobre <body>: el footer usa backdrop-filter
  // y, sin portal, cualquier z-index queda atrapado en ese contexto de capas.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const nativeInfo = await getNativeInfo().catch(() => null);
      if (alive) setInfo(nativeInfo);
      const result = await checkForUpdate();
      if (!alive) return;
      resultRef.current = result;
      setState(result.available ? 'available' : 'uptodate');
    })();
    return () => { alive = false; };
  }, []);

  const recheck = async () => {
    setState('checking');
    setMessage('');
    const result = await checkForUpdate({ force: true });
    resultRef.current = result;
    setState(result.available ? 'available' : 'uptodate');
  };

  // Un único botón: al pulsarlo se abre la tarjeta y arranca la descarga.
  const startUpdate = async () => {
    if (state === 'checking' || state === 'working') return;
    if (state === 'uptodate') {
      await recheck();
      return;
    }

    const result = resultRef.current;
    if (!result) return;

    setMessage('');
    setProgress({ downloaded: 0, total: result.downloadBytes || 0 });
    setOpen(true);
    setState('working');

    try {
      const res = await applyUpdate(result, (event) => {
        if (event?.phase !== 'download') return;
        setProgress({
          downloaded: Number(event.downloaded) || 0,
          total: Number(event.total) > 0 ? Number(event.total) : (result.downloadBytes || 0),
        });
      });
      if (res?.needSettings) {
        setMessage('Activa "Instalar apps desconocidas" en Ajustes y vuelve a pulsar.');
        setState('error');
        return;
      }
      setOpen(false);
      setState('uptodate');
    } catch (error) {
      setMessage(error?.message || 'No se pudo completar la actualización');
      setState('error');
    }
  };

  const busy = state === 'checking' || state === 'working';
  const result = resultRef.current;
  const total = progress.total || result?.downloadBytes || 0;
  const percent = total > 0 ? Math.min(100, Math.round((progress.downloaded * 100) / total)) : 0;
  const notes = String(result?.notes || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5)
    .join('\n');

  let Icon = Check;
  if (state === 'checking' || state === 'working') Icon = RefreshCw;
  else if (state === 'available' || state === 'error') Icon = Download;

  return (
    <>
      <button
        type="button"
        onClick={startUpdate}
        disabled={busy}
        aria-label={`Actualizaciones: ${LABELS[state]}`}
        className={`pill inline-flex items-center gap-1.5 px-2.5 py-1 font-semibold transition-colors ${
          state === 'available'
            ? 'bg-sky-400/20 text-sky-200 hover:bg-sky-400/30'
            : state === 'error'
              ? 'bg-amber-400/15 text-amber-200 hover:bg-amber-400/25'
              : 'bg-white/10 text-white/75 hover:bg-white/15'
        } disabled:opacity-70`}
      >
        <Icon size={13} className={busy ? 'animate-spin' : ''} />
        <span>{LABELS[state]}</span>
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#040812]/95 p-3 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Actualizando Reloadex"
          onClick={() => state !== 'working' && setOpen(false)}
        >
          <div
            className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#0d1528] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                  <Download size={19} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {state === 'error' ? 'Actualización detenida' : 'Actualizando Reloadex'}
                  </h2>
                  <p className="mt-0.5 text-xs text-white/50">
                    {result?.versionName || 'Nueva versión'}
                    {info?.versionName ? ` · instalada v${info.versionName}` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={state === 'working'}
                className="rounded-full p-1.5 text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
                aria-label="Cerrar"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Descarga</p>
                <p className="mt-1 text-sm font-semibold text-white">~{mb(result?.downloadBytes)}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Paquete</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {result?.nativeUpdate ? 'APK completo' : 'Solo cambios'}
                </p>
              </div>
            </div>

            {notes && (
              <div className="mt-4 max-h-24 overflow-hidden rounded-2xl bg-black/25 p-3 text-xs leading-relaxed text-white/60 whitespace-pre-line">
                {notes}
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-white/75">
                <span>{state === 'error' ? 'Progreso' : 'Descargando'}</span>
                <span>{percent}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-sky-400 transition-[width] duration-150"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-white/45">
                {mb(progress.downloaded)} de {mb(total)}
              </p>
            </div>

            {message && (
              <p className="mt-3 text-xs leading-relaxed text-amber-200/90">{message}</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default UpdateButton;
