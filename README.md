# Regalos Mágico

Tienda de regalos con pedido por **WhatsApp**. Repositorio unificado con la **app web** y la **app móvil**.

## Estructura

| Carpeta | Qué es | Stack |
|---------|--------|--------|
| **`app-web/`** | Tienda web (SPA + API opcional) | React 19, Vite 6, TypeScript, Tailwind v4, Express, PostgreSQL |
| **`app-movil/`** | App Expo (Android / iOS / web) | Expo SDK 54, React Native |

## App web (`app-web/`)

```bash
cd app-web
npm install
cp .env.example .env    # PowerShell: Copy-Item .env.example .env
npm run dev             # http://localhost:5173
npm run build           # compila a dist/
```

- Catálogo local o vía API (`VITE_USE_API` en `.env`).
- Backend en `app-web/backend/` (puerto 8081 en desarrollo).
- Despliegue: ver `app-web/DEPLOY-EQUIPO1.md`.

## App móvil (`app-movil/`)

```bash
cd app-movil
npm install
npm run start:lan       # QR con Expo Go (misma Wi‑Fi)
npm run web             # versión web con Expo
```

- Catálogo empaquetado en `assets/catalog/`.
- Regenerar catálogo: `npm run generate-catalog` (ver README interno).

## Autores

Juliana Chantre Astudillo · Manuel Arturo Legarda

Proyecto Electiva 5 — Regalo Mágico.
