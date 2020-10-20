<template lang="pug">
  ContactsUserHeader(:name="userName" @logout="onLogout")
  //- ContactsTable
  section.contacts
    header
      h1 Contacts
      div
        button(@click="onCreate") Create
      div
        input(type="text" placeholder="Search" v-model="search")
    
    template(v-if="records.length")
      table
        tr
          th Name
          th Email
          th Phone
          th
        template(v-for="row, i in records")
          template(v-if="row.id === id" :key="row.id")
            tr.edit
              td(colspan="3")
                table
                  tr
                    th Name
                    td 
                      input(type="text" v-model="row.name")
                  tr
                    th Email
                    td
                      input(type="text" v-model="row.email")
                  tr
                    th Phone
                    td
                      input(type="text" v-model="row.phone")
              td.control
                button(@click="onSave") Save
                button(@click="onCancel") Cancel
                template(v-if="!isNewRecord")
                  button(@click="onRemove") Remove
          template(v-else)
            tr
              td {{row.name}}
              td {{row.email}}
              td {{row.phone}}
              td 
                button(@click="onEdit(row, i)") Edit
    footer
      template(v-if="search") Found {{ records.length }} of {{ contacts.data.length }} record(s)
      template(v-else-if="contacts.loading") Loading....
      template(v-else) {{ records.length }} record(s)
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
    save,
    append,
    clear,
    getIndexById,
    getLastId,
  } from '../store/contacts'
  import ContactsUserHeader from '../components/ContactsUserHeader.vue'

  const UNSELECTED = -1

  export default defineComponent({
    components: {
      ContactsUserHeader,
    },

    setup() {
      const router = useRouter()

      watch(
        () => user.authorized,
        (v) => {
          !v && router.push({ name: 'login' })
        },
        { immediate: true }
      )

      load(user)

      return {
        userName: user.name,
        exit,
        contacts,
      }
    },

    data() {
      return {
        id: UNSELECTED,
        backup: {} as ContactRecord,
        search: '',
        isNewRecord: false,
      }
    },

    computed: {
      records() {
        let _data = [...contacts.data]
        if (this.search) {
          // perform search
          let search = this.search.toUpperCase()
          _data = _data.filter((v: ContactRecord) =>
            (v.name + v.email + v.phone).toUpperCase().includes(search)
          )
        }

        if (this.isNewRecord) {
          // insert temporary new record
          this.backup = {
            id: getLastId() + 1,
            name: '',
            email: '',
            phone: '',
          }
          _data.unshift(this.backup)
          this.id = this.backup.id
        }
        return _data
      },
    },

    methods: {
      onLogout() {
        clear()
        exit()
      },

      onEdit(row: ContactRecord) {
        if (this.id > UNSELECTED) {
          if (!window.confirm('Discard unsaved changes?')) return
          this.onCancel()
        }
        this.id = +row.id
        this.backup = Object.assign({}, row)
      },

      async onSave() {
        if (this.isNewRecord) {
          let newRecord = this.records[0]
          if (newRecord.name || newRecord.email || newRecord.phone) {
            await append(newRecord)
          }
          this.isNewRecord = false
        } else {
          await save()
        }
        this.unselectRecord()
      },

      onCancel() {
        if (this.isNewRecord) {
          this.isNewRecord = false
        } else {
          const index = getIndexById(this.backup.id)
          if (index !== false) {
            this.contacts.data[index] = this.backup
          }
        }
        this.unselectRecord()
      },

      onRemove(id: number) {
        if (window.confirm('Really remove?')) {
          remove(this.id)
          this.unselectRecord()
        }
      },

      onCreate() {
        if (this.id > UNSELECTED) {
          if (window.confirm('Discard unsaved changes?')) {
            this.onCancel()
            this.isNewRecord = true
          }
        } else {
          this.isNewRecord = true
        }
      },

      unselectRecord() {
        this.id = UNSELECTED
      },
    },
  })
</script>

<style lang="scss">
  .contacts {
    width: 80%;
    margin: 0 auto;
    header {
      display: flex;
      align-items: center;
      h1 {
        flex: 1 0;
        text-align: left;
      }
      > div {
        margin-left: 10px;
      }
    }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
    td,
    th {
      text-align: left;
      padding: 5px 0;
      border-bottom: 1px solid #ccc;
    }
    td:last-child {
      width: 1%;
      text-align: right;
      padding-right: 0;
    }
    tr.edit {
      > td {
        // padding: 0;
        background: #eee;
      }
      table {
        width: 100%;
        margin-bottom: -1px;
        th,
        td {
          border: 0;
          padding: 2px 10px;
        }
        th {
          font-size: 85%;
        }
        td:last-child {
          width: 99%;
        }
        input {
          width: 100%;
          box-sizing: border-box;
        }
      }
      > td.control {
        padding-right: 6px;
        vertical-align: top;
        button {
          width: 100%;
          box-sizing: border-box;
          min-width: auto;
          display: block;
          margin-bottom: 4px;
        }
      }
    }
  }
  footer {
    background: #eee;
    text-align: left;
    padding: 10px;
    font-size: 85%;
  }
</style>
