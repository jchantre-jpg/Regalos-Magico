/**
 * Configuración del catálogo remoto vía variables de entorno Expo.
 * Por defecto usa catálogo local (catalog.generated.ts).
 */
export function resolveCatalogMode(): {
  apiBase: string;
  imageBase: string;
  useRemote: boolean;
} {
  const apiBase = process.env.EXPO_PUBLIC_CATALOG_API?.trim() || '';
  const imageBase = process.env.EXPO_PUBLIC_CATALOG_IMAGE_BASE?.trim() || '';
  const flag = process.env.EXPO_PUBLIC_USE_REMOTE_CATALOG?.trim().toLowerCase();
  const useRemote =
    (flag === '1' || flag === 'true' || flag === 'yes') && apiBase.length > 0;
  return { apiBase, imageBase, useRemote };
}
