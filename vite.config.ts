import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, {VantResolve} from 'vite-plugin-style-import';
import {Icon} from '@iconify/vue';

// module.exports = {
//     server: {
//         proxy: {
//             '/useSMMS': {
//                 // target: 'https://smms.app/api/v2',
//                 target: 'https://smms.app/api/v2',
//                 changeOrigin: true,
//                 rewrite: (path) => path.replace(/^\/useSMMS/, '') // 不可以省略rewrite
//             }
//         }
//     },
//     components: {
//         Icon,
//     },
// }

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), styleImport({
        resolves: [VantResolve()],
    }),],
    server: {
        proxy: {
            '/useSMMS': {
                // target: 'https://sm.ms/api/v2',
                target: 'https://smms.app/api/v2',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/useSMMS/, '') // 不可以省略rewrite
            }
        }
    },
})
