/**
 * Opciones de categoría para el formulario admin (sin "todos").
 */
import { CATEGORIAS } from './categories';

/** Par id/etiqueta para el selector de categoría en admin. */
export type CategoryOption = { id: string; label: string };

/**
 * Categorías disponibles al crear/editar producto en admin.
 * Excluye "todos" porque ese id solo sirve para filtrar en la tienda (useCatalog).
 */
export const ADMIN_FORM_CATEGORIES: CategoryOption[] = CATEGORIAS.filter((c) => c.id !== 'todos').map(
  (c) => ({ id: c.id, label: c.nombre })
);
