import { Client, Account, Databases } from 'appwrite'

const client = new Client()
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('account-manager-vue-test')

export const databases = new Databases(client)
export const account = new Account(client)
export { ID } from 'appwrite'