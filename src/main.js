import './assets/base.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/icon/iconfont.css'
import VueCookies from 'vue-cookies'
const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.config.globalProperties.VueCookies = VueCookies
app.mount('#app')
