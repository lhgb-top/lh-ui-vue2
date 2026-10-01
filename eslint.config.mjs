import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import eslintPluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

// Vue2 规则集：plus 用的是 flat/recommended（vue3），本库必须用 flat/vue2-*
export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/coverage/**',
      '**/dist/**',
      '**/es/**',
      '**/lib/**',
      '**/theme/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/vue2-recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // 测试文件里定义本地 Consumer 辅助组件是合法模式，不属于「一文件多组件」坏味道
    files: ['tests/**/*.spec.ts'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
)
