<script setup lang="ts">
import { computed, type Component } from 'vue'
import StatusChip from '@/components/ui/StatusChip.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { getStatusMeta } from '@/composables/useSensorStatus'

const props = withDefaults(defineProps<{
    icon: Component
    label: string
    percent: number
    sensorOk?: boolean
    unavailableMessage?: string
}>(), {
    sensorOk: true
})

const status = computed(() => getStatusMeta(props.percent, props.sensorOk))
</script>

<template>
    <div class="bg-white p-5 rounded-xl border border-ropi-light shadow-sm flex items-start gap-4">
        <div class="p-3 bg-ropi-bg text-ropi-primary rounded-lg shrink-0">
            <component :is="icon" class="w-6 h-6" />
        </div>

        <div class="w-full">
            <p class="text-sm font-medium text-ropi-dark/70">{{ label }}</p>

            <div class="flex items-baseline justify-between mt-1">
                <p class="text-2xl font-bold text-ropi-dark">{{ percent }}%</p>
                <StatusChip :label="status.label" :badge-class="status.badgeClass" />
            </div>

            <div class="mt-3">
                <ProgressBar :percent="percent" :bar-class="status.barClass" />
            </div>

            <p v-if="!sensorOk && unavailableMessage" class="text-xs text-slate-500 mt-2">
                {{ unavailableMessage }}
            </p>
        </div>
    </div>
</template>