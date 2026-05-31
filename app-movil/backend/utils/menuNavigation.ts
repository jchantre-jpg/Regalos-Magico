/**
 * Navegación del menú lateral hacia secciones o panel admin.
 */
import type { MenuAction, SectionKey } from '../types/store';

/** Cada ítem del menú (excepto admin) hace scroll a su SectionKey en App. */
const SCROLL_SECTIONS: Record<SectionKey, SectionKey> = {
  inicio: 'inicio',
  categorias: 'categorias',
  productos: 'productos',
  como: 'como',
  contacto: 'contacto',
};

/** Comprueba si la acción del menú es válida antes de navegar. */
export function isMenuAction(action: string): action is MenuAction {
  return action === 'admin' || action in SCROLL_SECTIONS;
}

/** Callbacks que App.tsx pasa al manejador del menú lateral (handleMenuAction). */
export type MenuNavigationHandlers = {
  /** Desde useSectionScroll — scroll animado a la sección. */
  scrollToSection: (key: SectionKey) => void;
  /** Al ir a "inicio" se resetea a 'todos'. */
  setCategoriaActiva: (id: string) => void;
  /** Abre AdminModal (acción 'admin' del NavMenu). */
  openAdmin: () => void;
};

/** Ejecuta scroll a sección o abre admin según la acción del menú. */
export function handleMenuNavigation(action: MenuAction, handlers: MenuNavigationHandlers): void {
  if (action === 'admin') {
    handlers.openAdmin();
    return;
  }
  // Al volver a inicio, quitar filtro de categoría antes del scroll
  if (action === 'inicio') {
    handlers.setCategoriaActiva('todos');
  }
  // Resto de acciones: solo desplazan el ScrollView principal (useSectionScroll)
  handlers.scrollToSection(SCROLL_SECTIONS[action]);
}
