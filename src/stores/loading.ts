import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading = ref(false)

    const set = (loading: boolean) => {
        isLoading.value = loading
    }

    const start = () => {
        isLoading.value = true
    }

    const stop = () => {
        isLoading.value = false
    }

    return {
        isLoading,
        set,
        start,
        stop
    }
})