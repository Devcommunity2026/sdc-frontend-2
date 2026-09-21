import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    Sitemap({
      hostname: 'https://sdc.medicaps.ac.in',
      // Explicitly tell Google exactly what pages exist on your new site
      dynamicRoutes: [
        '/about',
        '/team',
        '/careers',
        '/events',
        '/projects'
      ],
      exclude: [
        '/google2b1145d466d0733b', 
        '/google2b1145d466d0733b.html'
      ],
      // Optional: If you don't use extensions on your new paths
      changefreq: 'monthly',
    }),
  ],
  // This block is to optimize bundle chunks 
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules/, // Separates npm packages into their own file
            },
          ],
        },
      },
    },
  },
})
