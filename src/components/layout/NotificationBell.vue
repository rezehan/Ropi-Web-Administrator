<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, AlertTriangle, BatteryWarning } from 'lucide-vue-next'
import { useClickOutside } from '@/composables/useClickOutside'

interface NotificationItem {
    id: number
    title: string
    time: string
    read: boolean
    icon: typeof Bell
    iconClass: string
}

// TODO: ganti dengan fetch/subscribe ke notifikasi asli (anomali, baterai lemah, dll)
const notifications = ref<NotificationItem[]>([
    { id: 1, title: 'Status berubah menjadi Waspada', time: '5 menit lalu', read: false, icon: AlertTriangle, iconClass: 'text-amber-500' },
    { id: 2, title: 'Baterai vest di bawah 20%', time: '1 jam lalu', read: false, icon: BatteryWarning, iconClass: 'text-rose-500' },
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)

useClickOutside(panelRef, () => (isOpen.value = false))

function markAllAsRead() {
    notifications.value.forEach((n) => (n.read = true))
}
</script>

<template>
    <div ref="panelRef" class="relative">
        <button type="button" class="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            @click="isOpen = !isOpen">
            <Bell class="w-5 h-5 text-slate-500" />
            <span v-if="unreadCount > 0"
                class="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center">
                {{ unreadCount }}
            </span>
        </button>

        <div v-if="isOpen"
            class="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span class="text-sm font-semibold text-slate-700">Notifikasi</span>
                <button v-if="unreadCount > 0" type="button" class="text-xs text-ropi-primary hover:underline"
                    @click="markAllAsRead">
                    Tandai semua dibaca
                </button>
            </div>

            <ul v-if="notifications.length > 0" class="max-h-80 overflow-y-auto">
                <li v-for="item in notifications" :key="item.id"
                    class="flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0"
                    :class="!item.read && 'bg-ropi-bg/40'">
                    <component :is="item.icon" class="w-4 h-4 mt-0.5 shrink-0" :class="item.iconClass" />
                    <div class="min-w-0">
                        <p class="text-sm text-slate-700 leading-snug">{{ item.title }}</p>
                        <p class="text-xs text-slate-400 mt-0.5">{{ item.time }}</p>
                    </div>
                </li>
            </ul>

            <p v-else class="text-sm text-slate-400 text-center py-6">Tidak ada notifikasi</p>
        </div>
    </div>
</template>