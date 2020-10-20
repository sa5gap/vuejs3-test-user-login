<template lang="pug">
  form
    h2 {{title}}
    input(type="text" v-model.trim="name" placeholder="Login")
    input(type="password" v-model.trim="password" placeholder="Password")
    small.error(v-if="error") {{ error }}
    input(type="submit" @click.prevent="login" :value="buttonText")
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue'

  export default defineComponent({
    props: {
      title: {
        type: String,
        default: 'Login',
      },
      error: String,
      busy: Boolean,
    },
    setup(props, { emit }) {
      let name = ref('')
      let password = ref('')
      let buttonText = computed(() => (props.busy ? 'Please wait...' : 'Login'))

      const login = () => {
        emit('login', name, password)
      }

      return { name, password, login, buttonText }
    },
  })
</script>

<style lang="scss" scoped>
  form {
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
