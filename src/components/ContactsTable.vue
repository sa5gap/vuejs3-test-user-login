<template lang="pug">
  .contacts
    header
      h1 Contacts
      div
        button(@click="onCreate") Create
      div
        input(type="text" placeholder="Search" v-model="search")

    table(v-if="records.length")
      tr
        th(v-for="col in cols") {{col}}
        th
      template(v-for="row, i in recordsFiltered")
        template(v-if="row.id === editedRow.id")
          tr.edit
            td(colspan="3")
              table
                tr
                  th Name
                  td 
                    input(type="text" v-model="editedRow.name")
                tr
                  th Email
                  td
                    input(type="text" v-model="editedRow.email")
                tr
                  th Phone
                  td
                    input(type="text" v-model="editedRow.phone")
            td.control
              button(@click="onUpdate") Update
              button(@click="onCancel") Cancel
              button(@click="onRemove" v-if="!isCreated") Remove
        template(v-else)
          tr
            td(v-for="_, col in cols") {{row[col]}}
            td 
              button(@click="onEdit(row)") Edit
    footer
      template(v-if="search") Found {{ recordsFiltered.length }} of {{ records.length }} record(s)
      template(v-else-if="isLoading") {{ isLoading || 'Loading....'}}
      template(v-else) {{ recordsFiltered.length }} record(s)
</template>

<script lang="ts">
  import { defineComponent, computed, ref, unref } from 'vue'

  const cols = { name: 'Name', email: 'Email', phone: 'Phone' }

  export default defineComponent({
    props: {
      records: {},
      isLoading: [Boolean, String],
    },

    setup(props, { emit }) {
      const search = ref('')
      const editedRow = ref<any>({})
      const isCreated = ref(false)

      const recordsFiltered = computed(() => {
        let t: any[] = []
        isCreated.value && t.push(editedRow.value)
        Array.isArray(props.records) && t.push(...props.records)

        if (search.value) {
          let s = search.value.toUpperCase().trim()
          t = t.filter(
            (v: any) =>
              v.id === editedRow.value.id ||
              ((v.name || '') + ' ' + (v.email || '') + ' ' + (v.phone || ''))
                .toUpperCase()
                .includes(s)
          )
        }
        return t
      })

      const onEdit = (row: any) => {
        isCreated.value = false
        editedRow.value = Object.assign({}, row)
      }

      const onCancel = () => {
        isCreated.value = false
        editedRow.value = {}
      }

      const onUpdate = () => {
        emit('update', unref(editedRow), isCreated.value, () => {
          editedRow.value = {}
          isCreated.value = false
        })
      }

      const onRemove = () => {
        if (window.confirm('Realy remove?')) {
          emit('remove', unref(editedRow), () => {
            editedRow.value = {}
          })
        }
      }

      const onCreate = () => {
        editedRow.value = { id: -1, name: '', email: '', phone: '' }
        isCreated.value = true
      }

      return {
        cols,
        recordsFiltered,
        editedRow,
        onEdit,
        onUpdate,
        onCancel,
        onRemove,
        onCreate,
        isCreated,
        search,
      }
    },
  })
</script>

<style lang="scss" scoped>
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
