import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "script",
      includeAssets: ["favicon.ico", "metroRoutes.geojson"],
      manifest: {
        id: "/",
        name: "LkoMetro",
        short_name: "LkoMetro",
        description: "Lucknow Metro route planner with live train tracking, fares and crowd estimates",
        theme_color: "#DC2626",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "en-IN",
        dir: "ltr",
        categories: ["travel", "navigation", "transportation"],
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Plan Route",
            short_name: "Route",
            description: "Plan your metro journey",
            url: "/?action=route",
            icons: [{ src: "/pwa-192x192.png", sizes: "192x192" }],
          },
        ],
        prefer_related_applications: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,geojson,json}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "osm-tiles",
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.geojson"],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "lucide-react"],
          leaflet: ["leaflet"],
          data: ["./src/data/metroData.ts", "./src/data/timetable.ts"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
  },
}));
