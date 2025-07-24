import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import bundleAnalyzer from 'vite-bundle-analyzer'
import path from 'path'

// Separate config for bundle analysis
export default defineConfig({
  plugins: [
    react(), 
    vanillaExtractPlugin(),
    bundleAnalyzer({
      analyzerMode: 'static',
      openAnalyzer: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
}) 