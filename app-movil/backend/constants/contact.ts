/**
 * Datos de contacto y mensaje base para pedidos por WhatsApp.
 * Configurar EXPO_PUBLIC_WHATSAPP_NUMBER en .env (código de país + número, sin +).
 */
export const WHATSAPP_NUMBER = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? '';

export const WHATSAPP_BASE_MESSAGE = 'Hola, quiero hacer un pedido desde RegaloMagico:';
