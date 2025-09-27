import './assets/base.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/icon/iconfont.css'
import VueCookies from 'vue-cookies'
import Message from './utils/Message'
import Confirm from './utils/Confirm'
import Request from './utils/request'
import Verify from './utils/Verify'
import Dialog from './components/Dialog.vue'
const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.component('Dialog',Dialog)
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.config.globalProperties.Confirm = Confirm
app.config.globalProperties.Verify = Verify
app.mount('#app')
