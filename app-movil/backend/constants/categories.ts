/**
 * Categorías del catálogo (filtro en tienda y etiquetas en admin).
 */
/** Categoría de la tienda: id para filtro, nombre visible e icono emoji. */
export type Categoria = { id: string; nombre: string; icono: string };

/**
 * Lista para filtros en tienda (useCatalog.categoriaActiva).
 * "todos" solo existe en el hook; CategoryGrid filtra id !== 'todos'.
 */
export const CATEGORIAS: Categoria[] = [
  { id: 'todos', nombre: 'Todos', icono: '✨' }, // solo useCatalog; no en CategoryGrid
  { id: 'desayunos', nombre: 'Desayunos', icono: '🍳' },
  { id: 'flores', nombre: 'Flores', icono: '🌸' },
  { id: 'chocolates', nombre: 'Chocolates', icono: '🍫' },
  { id: 'peluches', nombre: 'Peluches', icono: '🧸' },
  { id: 'globos', nombre: 'Globos', icono: '🎈' },
  { id: 'personalizados', nombre: 'Personalizados', icono: '✨' },
];
