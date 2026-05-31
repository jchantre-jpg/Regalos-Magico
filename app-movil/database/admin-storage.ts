/**
 * Persistencia local del panel admin (AsyncStorage).
 * Guarda overrides, productos creados en app y IDs eliminados del catálogo empaquetado.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Clave única en AsyncStorage para datos del panel admin. */
export const ADMIN_STORAGE_KEY = '@regalo_magico_admin_v2';

/**
 * Cambios parciales sobre un producto del catálogo original (sin duplicar el objeto entero).
 * Clave en persist.overrides: String(id del producto del catálogo empaquetado).
 */
export type ProductOverride = {
  nombre?: string;
  categoria?: string;
  precio?: number;
  emoji?: string;
  /** Texto principal en tarjeta y detalle (items y cantidades). */
  descripcion?: string;
  /** Texto extra solo en modal de detalle. */
  descripcionAdicional?: string;
  stock?: number;
  /** URIs file:// o https; la primera es la imagen principal en la tienda. */
  imageUris?: string[];
};

/** Producto creado desde cero en el admin (no existe en catalog.generated). */
export type CustomProductRecord = {
  id: number; // asignado con nextProductId en AdminPanel.saveForm
  nombre: string;
  categoria: string; // id de CATEGORIAS (sin "todos")
  precio: number;
  emoji: string;
  descripcion: string;
  descripcionAdicional: string;
  stock: number;
  imageUris: string[]; // file:// desde expo-image-picker
};

/** Estado completo que se serializa en el dispositivo (JSON en AsyncStorage). */
export type AdminPersisted = {
  /** Ediciones por id de producto del catálogo base (no borra el asset empaquetado). */
  overrides: Record<string, ProductOverride>;
  /** Productos nuevos creados solo en la app móvil. */
  customProducts: CustomProductRecord[];
  /** IDs del catálogo empaquetado ocultos en la tienda (soft delete). */
  deletedIds: number[];
};

/** Estado inicial vacío del admin (sin overrides ni customs). */
export function emptyAdminPersist(): AdminPersisted {
  return { overrides: {}, customProducts: [], deletedIds: [] };
}

/** Limpia arrays vacíos e IDs inválidos antes de guardar o después de leer. */
function sanitize(data: Partial<AdminPersisted>): AdminPersisted {
  // Normaliza datos leídos de disco o parciales antes de guardar o devolver al hook
  return {
    overrides: data.overrides ?? {},
    customProducts: (data.customProducts ?? []).map((c) => ({
      ...c,
      imageUris: Array.isArray(c.imageUris) ? c.imageUris.filter(Boolean) : [],
    })),
    deletedIds: [...new Set((data.deletedIds ?? []).filter((id) => Number.isFinite(id)))],
  };
}

/** Persiste el estado del admin en el dispositivo (JSON en AsyncStorage). */
export async function saveAdminData(data: AdminPersisted): Promise<void> {
  const clean = sanitize(data);
  await AsyncStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(clean));
}

/** Lee y sanitiza datos del admin; devuelve vacío si no hay o hay error. */
export async function loadAdminData(): Promise<AdminPersisted> {
  try {
    const raw = await AsyncStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return emptyAdminPersist();
    const parsed = JSON.parse(raw) as Partial<AdminPersisted>;
    return sanitize(parsed);
  } catch {
    // JSON corrupto o clave antigua: empezar con estado vacío
    return emptyAdminPersist();
  }
}
