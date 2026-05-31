/**
 * Credenciales del panel admin (solo validación local en la app).
 * Configurar en .env: EXPO_PUBLIC_ADMIN_USERNAME y EXPO_PUBLIC_ADMIN_PASSWORD
 */
export const ADMIN_USERNAME = process.env.EXPO_PUBLIC_ADMIN_USERNAME ?? '';

export const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD ?? '';
