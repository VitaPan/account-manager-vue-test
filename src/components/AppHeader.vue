<script setup lang="ts">
import { MapsHomeWorkFilled } from '@vicons/material'
import { ShieldCheckmarkOutline } from '@vicons/ionicons5'
import { useAccountsStore } from '@/stores/accounts'

const accountsStore = useAccountsStore()
</script>

<template>
  <header class="bg-linear-to-r from-gray-800 to-gray-900 shadow-2xl border-b border-gray-700/50 w-full backdrop-blur-sm">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-12 h-12 bg-linear-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <MapsHomeWorkFilled class="text-white w-6 h-6" />
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
          </div>
          <div class="pl-2">
            <h1 class="text-2xl font-bold bg-linear-to-r from-green-300 to-blue-400 bg-clip-text text-transparent">
              Account Manager
            </h1>
            <p class="text-sm text-gray-400 flex items-center gap-1">
              <ShieldCheckmarkOutline class="w-4 h-4 text-green-400" />
              Управление учетными записями системы
            </p>
          </div>
        </div>
        <div class="pt-7 sm:pt-0 ">
          <div class="text-right">
            <div class="text-xs text-gray-400 uppercase tracking-wide">Учетных записей :</div>
            <div class="text-2xl font-bold text-white">{{ accountsStore.accounts.length }}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
