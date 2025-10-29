import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import {
    create,
    NButton,
    NSpace,
    NIcon,
    NInput,
    NSelect,
    NNotificationProvider,
    NConfigProvider
} from 'naive-ui'

const native = create({
    components: [NButton, NSpace, NIcon, NInput, NSelect, NNotificationProvider, NConfigProvider]
})

const app = createApp(App)

app.use(createPinia())
app.use(native)
app.mount('#app')
