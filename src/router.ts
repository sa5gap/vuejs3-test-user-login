import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './components/Login.vue'
import Contacts from './components/Contacts.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/contacts', component: Contacts, name: 'contacts' },
  ],
})
