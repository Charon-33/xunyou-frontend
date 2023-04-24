import {createApp} from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router';
import routes from "./config/route";
import Vant from 'vant';
import 'vant/lib/index.css';
import '../global.css';
import { Uploader } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import "@icon-park/vue-next/styles/index.css";

import '@purge-icons/generated'

import MakeitCaptcha from 'makeit-captcha'
import 'makeit-captcha/dist/captcha.min.css'

const app = createApp(App);
app.use(Vant);

const router = VueRouter.createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
})

app.use(router);
app.use(Uploader);
app.use(Swipe);
app.use(SwipeItem);
app.use(MakeitCaptcha)

app.mount('#app')
