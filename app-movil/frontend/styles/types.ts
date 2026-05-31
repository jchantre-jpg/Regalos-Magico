/**
 * Tipo de estilos inferido desde createAppStyles (sin Record<string, object>).
 * Así el IDE reconoce cada clave (modalOverlay, productImage, etc.) sin marcar rojo.
 * Se pasa como prop `styles` a casi todos los componentes de frontend/components/.
 */
import type { createAppStyles } from './appStyles';

/** ReturnType del StyleSheet global creado en useResponsiveLayout. */
export type AppStyles = ReturnType<typeof createAppStyles>;
