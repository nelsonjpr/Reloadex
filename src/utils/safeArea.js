// Reserva el área segura superior del móvil: barra de estado, recortes de
// pantalla y zona de gestos. En escritorio (inset = 0) deja un margen mínimo.
export const safeTop = (extra = 16) => ({
  paddingTop: `calc(env(safe-area-inset-top, 0px) + ${extra}px)`,
});
