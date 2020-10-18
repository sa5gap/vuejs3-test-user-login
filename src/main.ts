import { createApp } from 'vue'

import { router } from './router'

import App from './App.vue'
// import { useUsers } from './store/useUsers'

// const { userState, authorize } = useUsers()
// authorize('admin', '123456')

createApp(App).use(router).mount('#app')
