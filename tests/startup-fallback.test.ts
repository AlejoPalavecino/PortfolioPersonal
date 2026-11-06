// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { restoreStartupScreen } from '../src/app/startup-fallback'

afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = '' })

const original = `<section class="startup-preboot" role="status">
  <h1>Preparando tu aventura</h1>
  <p class="startup-copy">El campamento está despertando…</p>
  <span class="startup-track"></span>
  <details class="startup-help">
    <summary>¿Demora demasiado?</summary>
    <a href="/">Reintentar</a>
    <a href="mailto:alejopalavecino12@gmail.com">Correo</a>
  </details>
</section>`

describe('pantalla visible previa al juego', () => {
  it('recupera un estado legible con enlaces si falla el montaje', () => {
    const root = document.createElement('div')
    root.id = 'app'
    root.innerHTML = '<main>Falló el render parcial</main>'
    document.body.append(root)
    restoreStartupScreen(root, original)
    expect(root.querySelector('main')).toBeNull()
    const section = root.querySelector<HTMLElement>('.startup-preboot')!
    expect(section.dataset.failed).toBe('true')
    expect(section.getAttribute('role')).toBe('alert')
    expect(section.querySelector('h1')!.textContent).toContain('No pudimos iniciar')
    expect(section.querySelector<HTMLDetailsElement>('details')!.open).toBe(true)
    expect(section.querySelector('a[href="/"]')).not.toBeNull()
    expect(section.querySelector('a[href^="mailto:"]')).not.toBeNull()
  })

  it('muestra el mensaje de recuperación en inglés si corresponde', () => {
    vi.stubGlobal('location', { search: '?lang=en' })
    const root = document.createElement('div')
    root.innerHTML = original
    restoreStartupScreen(root, original)
    expect(root.querySelector('h1')!.textContent).toBe('The camp could not start')
    expect(root.querySelector('.startup-copy')!.textContent).toContain('Try reloading')
  })

  it('puede ejecutarse sin el marcado auxiliar, sin introducir errores nuevos', () => {
    const root = document.createElement('div')
    restoreStartupScreen(root, '<div>Simple fallback</div>')
    expect(root.textContent).toBe('Simple fallback')
  })
})
