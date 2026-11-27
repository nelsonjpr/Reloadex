import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Download, RefreshCw, X } from 'lucide-react';
import {
  applyWebUpdate,
  checkForUpdate,
  getNativeInfo,
  installFullApk,
} from '../utils/updater';

const LABELS = {
  checking: 'Comprobando…',
  available: 'Actualizar',
  uptodate: 'Actualizado',
  working: 'Actualizando…',
  error: 'Reintentar',
};

const UpdateButton = () => {
  const [state, setState] = useState('checking');
  const [info, setInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const resultRef = useRef(null);

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
    const result = await checkForUpdate({ force: true });
    resultRef.current = result;
    setState(result.available ? 'available' : 'uptodate');
  };

  const handleClick = () => {
    if (state === 'available') setOpen(true);
    else if (state === 'uptodate' || state === 'error') recheck();
  };

  const handleWebUpdate = async () => {
    setState('working');
    setMessage('Descargando solo los archivos cambiados…');
    try {
      await applyWebUpdate(resultRef.current);
      setOpen(false);
      setState('uptodate');
    } catch (error) {
      setMessage(error?.message || 'No se pudo completar la actualización');
      setState('error');
    }
  };

  const handleApk = async () => {
    setMessage('Preparando el APK completo…');
    try {
      const res = await installFullApk(resultRef.current);
      if (res?.needSettings) {
        setMessage('Activa "Instalar apps desconocidas" en Ajustes y vuelve a pulsar.');
      } else {
        setOpen(false);
        setMessage('El instalador de Android se abrirá en breve.');
      }
    } catch (error) {
      setMessage(error?.message || 'No se pudo abrir el instalador');
    }
  };

  const busy = state === 'checking' || state === 'working';
  const result = resultRef.current;
  const hasBundle = Boolean(result?.deltaUrl || result?.fullUrl);

  let Icon = Check;
  if (state === 'checking' || state === 'working') Icon = RefreshCw;
  else if (state === 'available') Icon = Download;
  else if (state === 'error') Icon = AlertCircle;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
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
        {state === 'available' && result?.versionName && (
          <span className="opacity-70">v{result.versionName}</span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Actualización disponible"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="glass-effect w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Actualización disponible</h2>
                <p className="mt-1 text-xs text-white/50">
                  {result?.versionName || 'Nueva versión'}
                  {info?.versionName ? ` · instalada v${info.versionName}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={state === 'working'}
                className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {result?.notes && (
              <div className="mb-5 max-h-48 overflow-y-auto whitespace-pre-line rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-white/70">
                {result.notes}
              </div>
            )}

            {message && (
              <p className="mb-4 text-xs text-amber-200/90">{message}</p>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleWebUpdate}
                disabled={!hasBundle || state === 'working'}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {state === 'working' ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                {state === 'working' ? 'Descargando cambios…' : 'Actualizar ahora (solo cambios)'}
              </button>
              <button
                type="button"
                onClick={handleApk}
                disabled={state === 'working'}
                className="w-full rounded-2xl border border-white/10 px-4 py-3 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                {info?.canInstallApps === false
                  ? 'Activar permiso de instalación (APK completo)'
                  : 'Descargar APK completo (cambios nativos)'}
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-white/35">
              La actualización rápida descarga únicamente los archivos que cambiaron.
              El APK completo solo es necesario si la nueva versión incluye cambios nativos.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateButton;
