<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, UserRound, LogOut } from 'lucide-vue-next'
import { useClickOutside } from '@/composables/useClickOutside'

withDefaults(defineProps<{
    name?: string
    role?: string
}>(), {
    name: 'Babinsa',
    role: 'Petugas Wilayah'
})

const emit = defineEmits<{
    logout: []
}>()

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)

useClickOutside(panelRef, () => (isOpen.value = false))

function handleLogout() {
    isOpen.value = false
    emit('logout')
}
</script>

<template>
    <div ref="panelRef" class="relative">
        <button type="button"
            class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            @click="isOpen = !isOpen">
            <div
                class="w-8 h-8 rounded-full bg-ropi-primary/10 text-ropi-primary flex items-center justify-center shrink-0">
                <UserRound class="w-4.5 h-4.5" />
            </div>
            <div class="text-left hidden sm:block">
                <p class="text-sm font-medium text-slate-700 leading-tight">{{ name }}</p>
                <p class="text-xs text-slate-400 leading-tight">{{ role }}</p>
            </div>
            <ChevronDown class="w-4 h-4 text-slate-400" />
        </button>

        <div v-if="isOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
            <router-link to="/profil-anak"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                @click="isOpen = false">
                <UserRound class="w-4 h-4" />
                Profil
            </router-link>
            <button type="button"
                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                @click="handleLogout">
                <LogOut class="w-4 h-4" />
                Keluar
            </button>
        </div>
    </div>
</template>