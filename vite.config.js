import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['@apollo/client']
  },
  optimizeDeps: {
    include: ['@apollo/client']
  },
  // Настройки для production сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Увеличиваем лимит предупреждений о размере чанков
    chunkSizeWarningLimit: 1000,
    // Оптимизация сборки
    rollupOptions: {
      output: {
        manualChunks: {
          // Выделяем библиотеки в отдельные чанки
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'apollo-vendor': ['@apollo/client', 'graphql'],
        },
      },
    },
  },
  // Базовый путь для деплоя (если приложение не в корне)
  // Раскомментируйте и укажите путь, если нужно:
  // base: '/web-adtools/',
})
