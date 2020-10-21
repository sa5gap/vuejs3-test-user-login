<template lang="pug">
  ContactsUserHeader(
    :name="userName" 
    @logout="onLogout"
  )
  ContactsTable(
    :records="contacts.data" 
    :isLoading="isLoading"
    @update="onUpdate"
    @remove="onRemove"
  )
</template>

<script lang="ts">
  import { defineComponent, toRef, watch, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { user, exit } from '../store/user'
  import {
    ContactRecord,
    contacts,
    load,
    remove,
    update,
    append,
    clear,
  } from '../store/contacts'
  import ContactsUserHeader from '../components/ContactsUserHeader.vue'
  import ContactsTable from '../components/ContactsTable.vue'

  export default defineComponent({
    components: {
      ContactsUserHeader,
      ContactsTable,
    },

    setup() {
      const router = useRouter()
      const isLoading = ref<string | boolean>(false)

      watch(
        () => user.authorized,
        (v) => {
          !v && router.push({ name: 'login' })
        },
        { immediate: true }
      )

      load(user)

      const onLogout = () => {
        clear()
        exit()
      }

      const onUpdate = async (
        row: ContactRecord,
        isNew: boolean,
        handler: any
      ) => {
        try {
          isLoading.value = 'Updating'
          if (isNew) {
            await append(row)
          } else {
            await update(row)
          }
          handler && handler()
        } catch (e) {
          // TODO: show error
          console.error(e)
        } finally {
          isLoading.value = false
        }
      }

      const onRemove = async (row: ContactRecord, handler: any) => {
        try {
          isLoading.value = 'Removing'
          await remove(row.id)
          handler && handler()
        } catch (e) {
          console.error(e)
        } finally {
          isLoading.value = false
        }
      }

      return {
        userName: user.name,
        contacts,
        onLogout,
        onUpdate,
        onRemove,
        isLoading,
      }
    },
  })
</script>
