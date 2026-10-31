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
        'HTMLInputElement', 'HTMLAudioElement', 'KeyboardEvent', 'PointerEvent', 'Event',
        'Audio', 'Image', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance',
        'matchMedia', 'fetch', 'setTimeout', 'clearTimeout', 'console', 'URL',
        'ResizeObserver', 'IntersectionObserver', 'Element', 'Node'].map(name => [name, 'readonly']))
    },
    plugins: { boundaries },
    settings: {
      'import/resolver': { node: { extensions: ['.js', '.ts', '.json', '.css'] } },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/main.ts', mode: 'full' },
        { type: 'domain', pattern: 'src/core/domain/**', mode: 'full' },
        { type: 'domain', pattern: 'src/core/camera/**', mode: 'full' },
        { type: 'domain', pattern: 'src/core/experience/**', mode: 'full' },
        { type: 'shared', pattern: 'src/shared/**', mode: 'full' },
        { type: 'shared', pattern: 'src/styles/**', mode: 'full' },
        { type: 'entity', pattern: 'src/entities/**', mode: 'full' },
        { type: 'feature', pattern: 'src/features/**', mode: 'full' },
        { type: 'widget', pattern: 'src/widgets/**', mode: 'full' },
        { type: 'app', pattern: 'src/app/**', mode: 'full' }
      ]
    },
    rules: {
      'boundaries/no-unknown': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/element-types': ['error', { default: 'disallow', rules: [
        { from: 'domain', allow: ['domain'] },
        { from: 'shared', allow: ['shared', 'domain'] },
        { from: 'entity', allow: ['entity', 'shared', 'domain'] },
        { from: 'feature', allow: ['feature', 'entity', 'shared', 'domain'] },
        { from: 'widget', allow: ['widget', 'feature', 'entity', 'shared', 'domain'] },
        { from: 'app', allow: ['app', 'widget', 'feature', 'entity', 'shared', 'domain'] }
      ] }]
    }
  }
);
