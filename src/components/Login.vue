<template lang="pug">
  form.form-login
    h2 Login
    input(type="text" v-model.trim="name" placeholder="Login")
    input(type="password" v-model.trim="password" placeholder="Password")
    small.error(v-if="error") {{ error }}
    input(type="submit" @click.prevent="login" :value="buttonText")
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { user, authorize } from '../store/useUsers'

  interface ComponentData {
    name: string | null
    password: string | null
    error: string | null
  }

  export default defineComponent({
    setup() {
      const router = useRouter()
      let data: ComponentData = reactive({
        name: null,
        password: null,
        error: null,
      })

      let buttonText = computed(() =>
        user.loading ? 'Please wait...' : 'Login'
      )

      const login = async () => {
        if (data.name && data.password) {
          data.error = null
          try {
            await authorize(data.name, data.password)
            if (user.authorized) {
              router.push({ name: 'contacts' })
              data.error = user.token
            } else {
              data.error = user.error
            }
          } catch (e) {
            data.error = e
          }
        } else {
          data.error = 'Please input name and password!'
        }
      }
      return { ...toRefs(data), buttonText, login }
    },

    // computed: {
    //   buttonText() {
    //     return user.loading ? 'Please wait...' : 'Login'
    //   },
    // },
    // methods: {
    //   async login() {
    //     if (this.name && this.password) {
    //       this.error = null
    //       try {
    //         await authorize(this.name, this.password)
    //         if (user.authorized) {
    //           this.$router.push({ name: 'contacts' })
    //           this.error = user.token
    //         } else {
    //           this.error = user.error
    //         }
    //       } catch (e) {
    //         this.error = e
    //       }
    //     } else {
    //       this.error = 'Please input name and password!'
    //     }
    //   },
    // },
  })
</script>

<style lang="scss">
  .form-login {
    margin: 0 auto;

    > * {
      display: block;
      margin: 0 auto 0.5rem auto;
    }

    .error {
      color: red;
    }
  }
</style>
