<template lang="pug">
  LoginForm(title="Login" @login="onLogin" :error="error")
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, computed, ref, Ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { user, authorize } from '../store/user'
  import LoginForm from '../components/LoginForm.vue'

  type OnLogin = (name: Ref<string>, password: Ref<string>) => Promise<void>

  export default defineComponent({
    components: { LoginForm },

    setup() {
      const router = useRouter()
      let error = ref<string | null>(null)

      const onLogin: OnLogin = async (name, password) => {
        if (name.value && password.value) {
          error.value = null
          try {
            await authorize(name.value, password.value)
            if (user.authorized) {
              router.push({ name: 'contacts' })
            } else {
              error.value = user.error
            }
          } catch (e) {
            error.value = e
          }
        } else {
          error.value = 'Please input your name and password!'
        }
      }

      return { onLogin, error }
    },
  })
</script>
