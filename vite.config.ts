import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, {VantResolve} from 'vite-plugin-style-import';
import { Icon } from '@iconify/vue';

module.exports = {
    plugins: [vue(), styleImport({
        resolves: [VantResolve()],
    }),],
    server: {
        proxy: {
            '/imgUp': {
                target: 'https://sm.ms/api/v2',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/imgUp/, '') // 不可以省略rewrite
            }
        }
    },
    components: {
        Icon,
    },
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), styleImport({
        resolves: [VantResolve()],
    }),]
})
