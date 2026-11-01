import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  { ignores: ['dist/**', 'public/**', 'Portfolio_Campamento_Documentacion_y_Assets_v1/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/*.ego.mjs'],
    languageOptions: { globals: Object.fromEntries(['taskSpace', 'console', 'window', 'document',
      'innerWidth', 'innerHeight', 'location', 'performance', 'setTimeout', 'HTMLImageElement',
      'getComputedStyle', 'navigator', 'Event', 'matchMedia', 'requestAnimationFrame'].map(name => [name, 'readonly'])) }
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      globals: Object.fromEntries(['window', 'document', 'navigator', 'location', 'history',
        'HTMLElement', 'HTMLButtonElement', 'HTMLAnchorElement', 'HTMLImageElement',
        'HTMLInputElement', 'HTMLAudioElement', 'HTMLCanvasElement', 'CanvasRenderingContext2D',
        'AudioContext', 'GainNode', 'StereoPannerNode', 'OscillatorType', 'MutationObserver',
        'KeyboardEvent', 'PointerEvent', 'Event',
        'Audio', 'Image', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance',
        'matchMedia', 'fetch', 'setTimeout', 'clearTimeout', 'console', 'URL',
        'ResizeObserver', 'IntersectionObserver', 'Element', 'Node'].map(name => [name, 'readonly']))
    },
    plugins: { boundaries },
    settings: {
      'import/resolver': { node: { extensions: ['.js', '.ts', '.json', '.css'] } },
      'boundaries/include': ['src/**/*'],
      'boundaries/files': [{ category: 'app-entry', pattern: 'src/main.ts' }],
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/core/domain/**', partialMatch: false },
        { type: 'domain', pattern: 'src/core/camera/**', partialMatch: false },
        { type: 'domain', pattern: 'src/core/experience/**', partialMatch: false },
        { type: 'domain', pattern: 'src/core/fx/**', partialMatch: false },
        { type: 'shared', pattern: 'src/shared/**', partialMatch: false },
        { type: 'shared', pattern: 'src/styles/**', partialMatch: false },
        { type: 'entity', pattern: 'src/entities/**', partialMatch: false },
        { type: 'feature', pattern: 'src/features/**', partialMatch: false },
        { type: 'widget', pattern: 'src/widgets/**', partialMatch: false },
        { type: 'app', pattern: 'src/app/**', partialMatch: false }
      ]
    },
    rules: {
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': ['error', { default: 'disallow', policies: [
        { from: { element: { type: 'domain' } }, allow: { to: { element: { type: ['domain'] } } } },
        { from: { element: { type: 'shared' } }, allow: { to: { element: { type: ['shared', 'domain'] } } } },
        { from: { element: { type: 'entity' } }, allow: { to: { element: { type: ['entity', 'shared', 'domain'] } } } },
        { from: { element: { type: 'feature' } }, allow: { to: { element: { type: ['feature', 'entity', 'shared', 'domain'] } } } },
        { from: { element: { type: 'widget' } }, allow: { to: { element: { type: ['widget', 'feature', 'entity', 'shared', 'domain'] } } } },
        { from: { file: { categories: 'app-entry' } }, allow: { to: { element: { type: ['app', 'widget', 'feature', 'entity', 'shared', 'domain'] } } } },
        { from: { element: { type: 'app' } }, allow: { to: { element: { type: ['app', 'widget', 'feature', 'entity', 'shared', 'domain'] } } } }
      ] }]
    }
  }
);
