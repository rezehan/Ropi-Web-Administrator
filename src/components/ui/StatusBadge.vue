<script setup lang="ts">
import { computed } from 'vue'

type StatusVariant =
    | 'normal' | 'waspada' | 'anomali'
    | 'online' | 'offline'
    | 'diproses' | 'selesai'

const props = defineProps<{
    status: StatusVariant
    label?: string
}>()

const config: Record<StatusVariant, { text: string; classes: string }> = {
    normal: { text: 'Normal', classes: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20' },
    waspada: { text: 'Waspada', classes: 'bg-amber-50 text-amber-600 ring-amber-500/20' },
    anomali: { text: 'Anomali', classes: 'bg-red-50 text-red-600 ring-red-500/20' },
    online: { text: 'Online', classes: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20' },
    offline: { text: 'Offline', classes: 'bg-slate-100 text-slate-500 ring-slate-400/20' },
    diproses: { text: 'Diproses', classes: 'bg-amber-50 text-amber-600 ring-amber-500/20' },
    selesai: { text: 'Selesai', classes: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20' }
}

const current = computed(() => config[props.status])
</script>

<template>
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset"
        :class="current.classes">
        <span class="w-1.5 h-1.5 rounded-full bg-current" />
        {{ label ?? current.text }}
    </span>
</template>