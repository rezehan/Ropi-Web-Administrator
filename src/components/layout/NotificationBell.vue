<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { Bell, AlertTriangle, BatteryWarning } from 'lucide-vue-next'
import { useClickOutside } from '@/composables/useClickOutside'
import { formatRelativeTime } from '@/utils/FormatTime'
import type { useRopiRealtime } from '@/composables/useRopiRealtime'
import type { RopiEvent } from '@/types/ropi'

interface NotificationItem {
    id: string
    title: string
    time: string
    read: boolean
    icon: typeof Bell
    iconClass: string
}

// Data yang sama yang di-provide sekali di AdminLayout.vue lewat provide('ropiRealtime', ...)
const ropiRealtime = inject<ReturnType<typeof useRopiRealtime>>('ropiRealtime')

if (!ropiRealtime) {
    console.warn('[NotificationBell] ropiRealtime belum di-provide — pastikan dipanggil di AdminLayout.vue')
}

const eventLabel: Partial<Record<RopiEvent, string>> = {
    bahaya_tarikan: 'Terdeteksi tarikan mencurigakan',
    bahaya_jatuh: 'Terdeteksi anak terjatuh'
}

// Event yang boleh muncul sebagai notifikasi — sama seperti whitelist di AnomalyHistory.vue.
// "normal" dan "telemetry" (heartbeat rutin) sengaja tidak dianggap notifikasi.
const NOTIFIABLE_EVENTS: RopiEvent[] = ['bahaya_jatuh', 'bahaya_tarikan']

/**
 * ts dari firmware kadang epoch detik, kadang epoch milidetik. Return null (bukan 0!)
 * kalau ts tidak ada/tidak valid, supaya pemanggil tahu harus fallback ke teks,
 * bukan ikut dihitung sebagai "detik ke-0" yang bikin selisih waktu jadi raksasa.
 */
function toSeconds(ts: number | undefined | null): number | null {
    if (!ts || ts <= 0) return null
    return ts >= 1e12 ? Math.floor(ts / 1000) : ts
}

/** Bungkus formatRelativeTime supaya timestamp kosong/rusak tidak nampilin angka ngawur. */
function safeRelativeTime(ts: number | undefined | null): string {
    const seconds = toSeconds(ts)
    return seconds === null ? 'waktu tidak diketahui' : formatRelativeTime(seconds)
}

// Notifikasi sudah dibaca dilacak manual di sisi UI (bukan dari server),
// jadi dipisah per jenis id supaya gak ketiban ulang tiap kali data MQTT masuk lagi.
const readIds = ref<Set<string>>(new Set())

const notifications = computed<NotificationItem[]>(() => {
    if (!ropiRealtime) return []

    const alarmItems: NotificationItem[] = ropiRealtime.alarmHistory.value
        .filter((alarm) => NOTIFIABLE_EVENTS.includes(alarm.event))
        .map((alarm) => {
            const id = `${alarm.device_id}-${alarm.ts}`
            return {
                id,
                title: eventLabel[alarm.event] ?? `Status anomali: ${alarm.event}`,
                time: safeRelativeTime(alarm.ts),
                read: readIds.value.has(id),
                icon: AlertTriangle,
                iconClass: 'text-amber-500'
            }
        })

    const batteryItems: NotificationItem[] = Object.values(ropiRealtime.deviceStatus)
        .filter((status) => typeof status.battery === 'number' && status.battery < 20)
        .map((status) => {
            const id = `${status.device_id}-battery`
            return {
                id,
                title: `Baterai vest di bawah 20% (${status.battery}%)`,
                time: safeRelativeTime(status.ts),
                read: readIds.value.has(id),
                icon: BatteryWarning,
                iconClass: 'text-rose-500'
            }
        })

    return [...alarmItems, ...batteryItems].sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
})

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)

useClickOutside(panelRef, () => (isOpen.value = false))

function markAllAsRead() {
    notifications.value.forEach((n) => readIds.value.add(n.id))
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