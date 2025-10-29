<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import type { IAccount } from '@/types/account'
import { TrashOutline as TrashIcon, AddOutline as AddIcon } from '@vicons/ionicons5'
import { NPopconfirm } from 'naive-ui'

const accountsStore = useAccountsStore()
const notification = ref<{ type: 'success' | 'error', message: string } | null>(null)

const showNotification = (type: 'success' | 'error', message: string) => {
    notification.value = { type, message }
    setTimeout(() => {
        notification.value = null
    }, 3000)
}

const addAccount = () => {
    accountsStore.addAccount()
    showNotification('success', 'Запись добавлена')
}

const deleteAccount = async (id: string) => {
    try {
        await accountsStore.deleteAccount(id)
        showNotification('success', 'Учетная запись удалена')
    } catch {
        showNotification('error', 'Ошибка при удалении учетной записи')
    }
}

const validateAccount = (account: IAccount): boolean => {
    account.errors = {}

    if (!account.type.trim()) {
        account.errors.type = 'Тип записи обязателен'
    }

    if (!account.login.trim()) {
        account.errors.login = 'Логин обязателен'
    } else if (account.login.length > 100) {
        account.errors.login = 'Логин не должен превышать 100 символов'
    }

    if (account.type === 'Локальная') {
        if (!account.password?.trim()) {
            account.errors.password = 'Пароль обязателен для локальных записей'
        } else if (account.password.length > 100) {
            account.errors.password = 'Пароль не должен превышать 100 символов'
        }
    }

    if (account.label && account.label.length > 50) {
        account.errors.label = 'Метка не должна превышать 50 символов'
    }

    return Object.keys(account.errors).length === 0
}

const validateAndSaveAccount = async (account: IAccount) => {
    const isValid = validateAccount(account)

    if (isValid) {
        try {
            await accountsStore.saveAccount(account)
            showNotification('success', 'Учетная запись успешно сохранена')
        } catch (error) {
            console.error('Ошибка при сохранении:', error)
            showNotification('error', 'Ошибка при сохранении учетной записи')
        }
    } else {
        showNotification('error', 'Исправьте ошибки в форме')
    }
}

const hasErrors = (account: IAccount): boolean => {
    return Object.keys(account.errors).length > 0
}

onMounted(() => {
    accountsStore.loadAccounts()
})
</script>

<template>
    <n-config-provider>
        <div class="min-h-screen bg-gray-900 text-white">
            <div v-if="notification" :class="[
                'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 max-w-sm transition-all duration-300',
                notification.type === 'success'
                    ? 'bg-green-900 border-green-400 text-green-100'
                    : 'bg-red-900 border-red-400 text-red-100'
            ]">
                <div class="flex items-center">
                    <div :class="[
                        'w-6 h-6 rounded-full flex items-center justify-center mr-3',
                        notification.type === 'success' ? 'bg-green-400' : 'bg-red-400'
                    ]">
                        <span class="text-sm font-bold">
                            {{ notification.type === 'success' ? '✓' : '!' }}
                        </span>
                    </div>
                    <p class="text-sm font-medium">{{ notification.message }}</p>
                </div>
            </div>

            <div class="mx-auto p-6">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                    <div class="mb-3">
                        <h1
                            class="text-xl font-bold bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent lg:text-3xl">
                            Создавайте и управляйте учетными записями системы
                        </h1>
                    </div>
                    <n-button @click="addAccount" strong secondary type="success" size="large">
                        <template #icon>
                            <n-icon>
                                <AddIcon />
                            </n-icon>
                        </template>
                        Добавить учетную запись
                    </n-button>
                </div>

                <div class="pt-3 p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <p class="text-sm text-gray-300">
                        <strong class="text-green-400">Подсказка для поля "Метка":</strong>
                        Вводите текстовые метки через знак <code
                            class="bg-gray-700 px-2 py-1 rounded text-green-300">;</code>
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-7">
                    <div v-for="account in accountsStore.accounts" :key="account.id"
                        class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-3">
                                    Метка
                                    <span class="text-gray-500 text-xs ml-1">(необязательно)</span>
                                </label>
                                <n-input v-model:value="account.label" @blur="validateAndSaveAccount(account)"
                                    type="text" placeholder="метка1; метка2; метка3" :maxlength="50" />
                                <p class="text-xs mt-2"
                                    :class="account.errors.label ? 'text-red-400' : 'text-gray-500'">
                                    {{ account.label?.length || 0 }}/50 символов
                                    <span v-if="account.errors.label" class="ml-2">• {{ account.errors.label }}</span>
                                </p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-3">
                                    Тип записи <span class="text-red-400">*</span>
                                </label>
                                <n-select v-model:value="account.type" @update:value="validateAndSaveAccount(account)"
                                    placeholder="Выберите тип" :options="[
                                        { label: 'LDAP', value: 'LDAP' },
                                        { label: 'Локальная', value: 'Локальная' }
                                    ]" :status="account.errors.type ? 'error' : 'success'" />
                                <p v-if="account.errors.type" class="text-xs text-red-400 mt-2">
                                    {{ account.errors.type }}
                                </p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-3">
                                    Логин <span class="text-red-400">*</span>
                                </label>
                                <n-input v-model:value="account.login" @blur="validateAndSaveAccount(account)"
                                    type="text" placeholder="Введите логин"
                                    :status="account.errors.login ? 'error' : 'success'" :maxlength="100" />
                                <p class="text-xs mt-2"
                                    :class="account.errors.login ? 'text-red-400' : 'text-gray-500'">
                                    {{ account.login?.length || 0 }}/100 символов
                                    <span v-if="account.errors.login" class="ml-2">• {{ account.errors.login }}</span>
                                </p>
                            </div>
                            <div v-if="account.type === 'Локальная'">
                                <label class="block text-sm font-medium text-gray-300 mb-3">
                                    Пароль <span class="text-red-400">*</span>
                                </label>
                                <n-input v-model:value="account.password" @blur="validateAndSaveAccount(account)"
                                    type="password" placeholder="Введите пароль"
                                    :status="account.errors.password ? 'error' : 'success'" :maxlength="100"
                                    show-password-on="click" />
                                <p class="text-xs mt-2"
                                    :class="account.errors.password ? 'text-red-400' : 'text-gray-500'">
                                    {{ account.password?.length || 0 }}/100 символов
                                    <span v-if="account.errors.password" class="ml-2">• {{ account.errors.password
                                    }}</span>
                                </p>
                            </div>

                            <div v-else></div>
                        </div>
                        <div class="flex justify-end mt-6 pt-4 border-t border-gray-700">
                            <n-popconfirm :positive-text="'Удалить'" :negative-text="'Отмена'"
                                @positive-click="deleteAccount(account.id)" placement="top-end">
                                <template #trigger>
                                    <n-button strong secondary type="error" size="medium"
                                        class="hover:scale-105 transition-transform">
                                        <template #icon>
                                            <n-icon>
                                                <TrashIcon />
                                            </n-icon>
                                        </template>
                                        Удалить
                                    </n-button>
                                </template>
                                <div class="max-w-xs">
                                    <p class="text-gray-600 text-sm">
                                        Удалить учетную запись
                                        <span class="font-medium">"{{ account.login }}"</span>?
                                    </p>
                                </div>
                            </n-popconfirm>
                        </div>

                        <div v-if="hasErrors(account)"
                            class="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                    <span class="text-xs font-bold text-white">!</span>
                                </div>
                                <p class="text-sm text-red-300 font-medium">
                                    Исправьте ошибки
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="accountsStore.accounts.length === 0 && !accountsStore.loading" class="text-center py-12">
                    <div class="text-gray-400">
                        <n-icon @click="addAccount" size="64"
                            class="mx-auto mb-4 opacity-50 hover:text-emerald-400 cursor-pointer">
                            <AddIcon />
                        </n-icon>
                        <p class="text-lg mb-2">Нет учетных записей</p>
                    </div>
                </div>
            </div>
        </div>
    </n-config-provider>
</template>
