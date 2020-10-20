<template lang="pug">
  div <b>{{ name }}</b> - 
    a(href="#" @click.prevent="$emit('logout')") Logout
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      name: String,
    },
  })
</script>
