import '@testing-library/jest-dom/vitest'
import '@/src/config/i18n'

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))