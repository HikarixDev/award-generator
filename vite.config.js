import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    base: "/award-generator/", // match your repo name exactly
    resolve: {
        alias: {
            "@": "/src"
        }
    }
})
