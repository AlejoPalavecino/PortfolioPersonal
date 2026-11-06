import { mount } from './app'
import { restoreStartupScreen } from './app/startup-fallback'
import './styles/main.css'

const root = document.querySelector<HTMLElement>('#app')
if (root) {
  const firstPaint = root.innerHTML
  try {
    mount(root)
  } catch (error) {
    console.error('Portfolio startup failed', error)
    restoreStartupScreen(root, firstPaint)
  }
}
