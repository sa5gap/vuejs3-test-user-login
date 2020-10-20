<template lang="pug">
  LoginForm(
    @login="onLogin" 
    :error="error"
    :busy="loading"
  )
</template>

<script lang="ts">
  import { defineComponent, toRef, ref, Ref, watch } from 'vue'
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

      return {
        onLogin,
        error,
        loading: toRef(user, 'loading'),
      }
    },
  })
</script>
