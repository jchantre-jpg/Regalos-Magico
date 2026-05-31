/**
 * Tipos compartidos de la tienda (capa backend).
 * Centraliza Product, carrito y claves de navegación para evitar duplicar definiciones.
 */
import type { CatalogProduct } from '../../database/catalog.generated';

/**
 * Producto visible en tienda: catálogo base + campos opcionales del admin.
 * Resultado de mergeCatalog + resolveProductImage en useCatalog.
 */
export type StoreProduct = CatalogProduct & {
  descripcionAdicional?: string; // Solo en modal de detalle
  stock?: number; // Mostrado en admin y opcional en tarjeta
  fromCustom?: boolean; // true si viene de customProducts (admin)
  /** Todas las fotos del producto (admin); la primera coincide con `image`. */
  imageUris?: string[];
};

/** Alias usado en componentes de catálogo y detalle. */
export type Product = StoreProduct;

/** Línea del carrito: producto + cantidad elegida por el usuario. */
export type CartItem = StoreProduct & { quantity: number };

/** Secciones con scroll anclado en la pantalla principal. */
export type SectionKey = 'inicio' | 'categorias' | 'productos' | 'como' | 'contacto';

/** Acciones del menú lateral: scroll a sección o abrir panel admin. */
export type MenuAction = SectionKey | 'admin';
