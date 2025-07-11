// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    base: "/award-generator/", // this is critical for GitHub Pages!
    plugins: [react()],
    resolve: {
        alias: {
            "@/components": "/src/components"
        }
    }
})
