/**
 * Capturas del manual RegaloMágico — tienda web (5174) + app móvil Expo web (8092)
 */
import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'manual-imagenes')
const WEB = process.env.WEB_URL || 'http://127.0.0.1:5174/'
const MOBILE = process.env.MOBILE_URL || 'http://127.0.0.1:8092/'

async function snap(page, name, opts = {}) {
  await page.screenshot({ path: path.join(OUT, name), ...opts })
  console.log('OK', name)
}

async function scrollToHash(page, hash) {
  await page.evaluate((h) => {
    document.querySelector(h)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, hash)
  await page.waitForTimeout(700)
}

async function captureWeb(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  await page.goto(WEB, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForSelector('.product-card, #productos', { timeout: 60000 })
  await page.waitForTimeout(1500)

  await snap(page, '01-web-inicio.png')
  await snap(page, '02-web-navegacion.png', { clip: { x: 0, y: 0, width: 1440, height: 88 } })

  await scrollToHash(page, '#categorias')
  await snap(page, '03-web-categorias.png')

  await scrollToHash(page, '#productos')
  await snap(page, '04-web-catalogo-productos.png')

  const verMas = page.locator('.product-card .view-detail').first()
  if (await verMas.count()) {
    await verMas.click()
    await page.waitForTimeout(600)
    await snap(page, '05-web-detalle-producto.png')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
  }

  const agregar = page.locator('.product-card .add-cart').first()
  if (await agregar.count()) {
    await agregar.click()
    await page.waitForTimeout(400)
  }
  const cartOpen = await page.locator('#cart-sidebar.active').count()
  if (!cartOpen) {
    await page.getByRole('button', { name: 'Ver carrito' }).click()
    await page.waitForTimeout(600)
  }
  await snap(page, '06-web-carrito-pedido.png')
  await page.getByRole('button', { name: 'Cerrar carrito' }).click()
  await page.waitForTimeout(300)

  await scrollToHash(page, '#como-funciona')
  await snap(page, '07-web-como-comprar.png')

  await scrollToHash(page, '#contacto')
  await snap(page, '08-web-contacto.png')

  await page.route('**/health', (r) => r.fulfill({ status: 200, body: 'ok' }))
  await page.route('**/admin/login', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'manual-demo-token', usuario: 'admin' }),
    })
  )
  await page.route('**/productos**', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          nombre: 'Desayuno Sorpresa Premium',
          categoria: 'desayunos',
          precio: 85000,
          emoji: '🎂',
          descripcion: 'Bandeja con globos y dulces.',
          fotos: [],
          cantidad: 5,
        },
        {
          id: 2,
          nombre: 'Ramo de rosas rojas',
          categoria: 'flores',
          precio: 72000,
          emoji: '🌹',
          descripcion: 'Flores frescas con lazo.',
          fotos: [],
          cantidad: 8,
        },
        {
          id: 3,
          nombre: 'Peluche con corazones',
          categoria: 'peluches',
          precio: 45000,
          emoji: '🧸',
          descripcion: 'Oso con mensaje de amor.',
          fotos: [],
          cantidad: 12,
        },
      ]),
    })
  )
  await page.goto(new URL('admin.html', WEB).href, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(800)
  await snap(page, '09-web-admin-login.png')

  await page.fill('#login-usuario', 'admin')
  await page.fill('#login-password', 'regalo2026')
  await page.locator('#login-form button[type="submit"]').click()
  await page.waitForTimeout(2500)
  await snap(page, '10-web-admin-productos.png')

  await context.close()
}

async function captureMobile(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()

  const menuItem = (label) => page.getByRole('dialog').getByText(label, { exact: true })

  await page.goto(MOBILE, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(3000)

  await snap(page, '11-movil-inicio.png')

  await page.getByText('☰').click()
  await page.waitForTimeout(600)
  await snap(page, '12-movil-menu.png')
  await menuItem('Categorias').click()
  await page.waitForTimeout(800)
  await snap(page, '13-movil-categorias.png')

  await page.getByText('☰').click()
  await page.waitForTimeout(400)
  await menuItem('Productos').click()
  await page.waitForTimeout(800)
  await snap(page, '14-movil-catalogo.png')

  const addBtn = page.getByText('Agregar', { exact: true }).first()
  if (await addBtn.count()) {
    await addBtn.click()
    await page.waitForTimeout(800)
  }
  const cartVisible = await page.getByText('Tu carrito', { exact: true }).isVisible().catch(() => false)
  if (!cartVisible) {
    await page.getByLabel('Abrir carrito').click({ force: true })
    await page.waitForTimeout(700)
  }
  await snap(page, '15-movil-carrito-whatsapp.png')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)

  await page.getByText('☰').click()
  await page.waitForTimeout(400)
  await menuItem('Administracion').click()
  await page.waitForTimeout(800)
  await snap(page, '16-movil-admin-login.png')

  const inputs = page.locator('input')
  if (await inputs.count()) {
    await inputs.nth(0).fill('admin')
    await inputs.nth(1).fill('regalo2026')
    await page.getByText('Entrar', { exact: true }).click()
    await page.waitForTimeout(1200)
    await snap(page, '17-movil-admin-listado.png')
  }

  await context.close()
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  await captureWeb(browser)
  await captureMobile(browser)
  await browser.close()
  console.log('\nListo ->', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
