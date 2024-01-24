import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
    return {
        plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
        dev: {
            headers: {
                "Cache-Control": "public, max-age=0",
            },
        },

        server: {
            port: 1112,
            proxy: {
                "/api": {
                    target: 'http://127.0.0.1:1112'
                }
            }
        },

        preview: {
            headers: {
                "Cache-Control": "public, max-age=600",
            },
        }
    };
});
