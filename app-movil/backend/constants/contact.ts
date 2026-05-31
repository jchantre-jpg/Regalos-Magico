/**
 * Datos de contacto y mensaje base para pedidos por WhatsApp.
 * Consumido por: backend/utils/whatsapp.ts, useWhatsApp, ContactSection, AdminPanel toolbar.
 */
/** Número con código de país (Colombia 57), sin + ni espacios — va en wa.me/NUMERO */
export const WHATSAPP_NUMBER = '573143562274';

/** Primera línea del mensaje al enviar pedido desde CartModal (luego líneas del carrito). */
export const WHATSAPP_BASE_MESSAGE = 'Hola, quiero hacer un pedido desde RegaloMagico:';
