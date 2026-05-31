/**
 * Fusión del catálogo base con datos del admin.
 * Aplica overrides, oculta eliminados y convierte productos custom al tipo StoreProduct.
 */
import type { ImageSourcePropType } from 'react-native';

import type { AdminPersisted, CustomProductRecord, ProductOverride } from '../../database/admin-storage';
import type { CatalogProduct } from '../../database/catalog.generated';
import type { StoreProduct } from '../types/store';

/** Re-export del tipo de producto en tienda (consumido por hooks y UI). */
export type { StoreProduct };

/** Imagen empaquetada con require() — en RN el tipo es number. */
export function isBundledSource(img: ImageSourcePropType): boolean {
  return typeof img === 'number';
}

/** Type guard: imagen cargada por URI (remota, file:// o galería). */
function isUriSource(img: ImageSourcePropType): img is { uri: string } {
  return typeof img === 'object' && img !== null && 'uri' in img && typeof (img as { uri: string }).uri === 'string';
}

/**
 * Lista final para la tienda: base − eliminados + overrides + customs, ordenada por id.
 */
export function mergeCatalog(base: CatalogProduct[], data: AdminPersisted | null): StoreProduct[] {
  // Si no hay datos guardados, se asume persistencia vacía (catálogo empaquetado puro)
  const persist = data ?? { overrides: {}, customProducts: [], deletedIds: [] };
  // Set para búsqueda O(1) de productos ocultos por el admin
  const deleted = new Set(persist.deletedIds);
  // Paso 1: catálogo base sin eliminados, aplicando override por id (clave string en JSON)
  const merged = base
    .filter((p) => !deleted.has(p.id))
    .map((p) => mergeOne(p, persist.overrides[String(p.id)]));
  // Paso 2: productos creados solo en la app (no existen en catalog.generated)
  const customs = persist.customProducts.map(customToStore);
  // Paso 3: unir y ordenar por id para listados estables en UI y búsqueda admin
  return [...merged, ...customs].sort((a, b) => a.id - b.id);
}

/** Aplica override sobre un producto del catálogo empaquetado (sin borrarlo del bundle). */
function mergeOne(p: CatalogProduct, o: ProductOverride | undefined): StoreProduct {
  // Sin override: conservar producto empaquetado; si solo hay URI, exponer imageUris
  if (!o) {
    if (isBundledSource(p.image)) return { ...p };
    const uris = isUriSource(p.image) ? [p.image.uri] : undefined;
    return uris ? { ...p, imageUris: uris } : { ...p };
  }

  // Lista completa de fotos: override > URI del producto base > undefined (solo require)
  const imageUris =
    o.imageUris && o.imageUris.length > 0
      ? o.imageUris
      : isUriSource(p.image)
        ? [p.image.uri]
        : undefined;

  // image (tarjeta) usa siempre la primera URI; si no hay, conserva require() del bundle
  const image =
    imageUris?.[0] != null
      ? { uri: imageUris[0] }
      : isBundledSource(p.image)
        ? p.image
        : p.image;

  return {
    ...p,
    // Campos opcionales del override: si no vienen, se mantiene el valor del catálogo base
    nombre: o.nombre ?? p.nombre,
    categoria: o.categoria ?? p.categoria,
    precio: o.precio ?? p.precio,
    emoji: o.emoji ?? p.emoji,
    descripcion: o.descripcion ?? p.descripcion,
    descripcionAdicional: o.descripcionAdicional,
    stock: o.stock,
    image,
    imageUris,
  };
}

/** Producto creado en admin → formato StoreProduct para la tienda. */
function customToStore(c: CustomProductRecord): StoreProduct {
  // Sin fotos en custom (no debería pasar tras validación del form): placeholder visible
  const image: ImageSourcePropType =
    c.imageUris[0] != null ? { uri: c.imageUris[0] } : { uri: 'https://via.placeholder.com/400?text=Regalo' };
  return {
    id: c.id,
    nombre: c.nombre,
    categoria: c.categoria,
    precio: c.precio,
    emoji: c.emoji,
    descripcion: c.descripcion,
    descripcionAdicional: c.descripcionAdicional,
    stock: c.stock,
    archivo: `custom-${c.id}`,
    image,
    imageUris: c.imageUris.length ? c.imageUris : undefined,
    // fromCustom: AdminPanel edita customProducts[] en lugar de overrides{}
    fromCustom: true,
  };
}

/** Siguiente ID libre (incluye eliminados para no reutilizar números). */
export function nextProductId(base: CatalogProduct[], data: AdminPersisted): number {
  // Incluir eliminados evita reutilizar un id que aún está en overrides o referencias
  const ids = [
    ...base.map((p) => p.id),
    ...data.customProducts.map((c) => c.id),
    ...data.deletedIds,
  ];
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

/** URIs para rellenar el formulario de edición en admin. */
export function getImageUrisForForm(product: StoreProduct, override: ProductOverride | undefined): string[] {
  // Prioridad: fotos guardadas en override admin → imageUris del producto → URI única de image
  if (override?.imageUris?.length) return override.imageUris;
  if (product.imageUris?.length) return product.imageUris;
  if (isUriSource(product.image)) return [product.image.uri];
  return []; // Producto solo con require(): el form puede exigir fotos nuevas (requirePhotos)
}

/** Indica si el producto ya tiene foto (empaquetada, URI o galería). */
export function catalogProductHasPhoto(product: StoreProduct): boolean {
  if (product.imageUris?.length) return true;
  if (isUriSource(product.image)) return true;
  return isBundledSource(product.image);
}
