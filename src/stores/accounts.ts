import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Client, Databases, ID } from 'appwrite'
import type { IAccount, ILabelObject } from '@/types/account'

const client = new Client()
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('account-manager-vue-test')

const DATABASE_ID = 'accounts_db'
const COLLECTION_ID = 'accounts'

const databases = new Databases(client)

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<IAccount[]>([])
  const loading = ref(false)

  const loadAccounts = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID)

      accounts.value = response.documents.map(doc => {
        let label = ''

        if (doc.labels) {
          try {
            const labelsArray = JSON.parse(doc.labels)
            label = labelsArray
              .map((item: ILabelObject) => item.text || '')
              .filter((text: string) => text.length > 0)
              .join('; ')
          } catch {
            label = doc.label || ''
          }
        } else {
          label = doc.label || ''
        }

        return {
          id: doc.$id,
          label: label,
          type: doc.type,
          login: doc.login,
          password: doc.password || null,
          errors: {},
          isNew: false
        }
      })
    } catch (error) {
      console.error('Ошибка загрузки:', error)
    }
  }

  const addAccount = () => {
    const newAccount: IAccount = {
      id: `local-${Date.now()}`,
      label: '',
      type: '',
      login: '',
      password: null,
      errors: {},
      isNew: true
    }
    accounts.value.push(newAccount)
  }

  const saveAccount = async (account: IAccount) => {
    try {
      const labelsObjects = account.label
        ? account.label.split(';')
          .map(label => label.trim())
          .filter(label => label.length > 0)
          .map(text => ({ text }))
        : []

      const accountData = {
        type: account.type,
        login: account.login,
        label: account.label || '',
        labels: JSON.stringify(labelsObjects),
        password: account.type === 'Локальная' ? account.password || '' : null
      }

      if (account.isNew) {
        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          accountData
        )

        account.id = response.$id
        account.isNew = false
      } else {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          account.id,
          accountData
        )
      }

    } catch (error: unknown) {
      throw error
    }
  }

  const deleteAccount = async (id: string) => {
    try {
      const account = accounts.value.find(acc => acc.id === id)
      if (account && !account.isNew) {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
      }
      accounts.value = accounts.value.filter(account => account.id !== id)
    } catch (error) {
      throw error
    }
  }

  return {
    accounts,
    loading,
    loadAccounts,
    addAccount,
    saveAccount,
    deleteAccount
  }
})