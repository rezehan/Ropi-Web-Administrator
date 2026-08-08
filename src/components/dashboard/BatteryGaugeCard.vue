<script setup lang="ts">
import { computed, toRef } from 'vue'
import { Battery } from 'lucide-vue-next'
import StatusChip from '@/components/ui/StatusChip.vue'
import { useBatteryGauge } from '@/composables/useBatteryGauge'
import { getBatteryStatusMeta } from '@/composables/useSensorStatus'

const props = defineProps<{
    percent: number
    history: number[]
}>()

const { canvasRef } = useBatteryGauge(toRef(props, 'percent'))

const status = computed(() => getBatteryStatusMeta(props.percent))

const trend = computed(() => {
    if (props.history.length < 2) return 0
    return props.history[props.history.length - 1] - props.history[0]
})
</script>

<template>
    <div class="bg-white rounded-xl shadow-lg p-5 md:p-6">
        <div class="flex flex-col md:flex-row md:items-center gap-6">

            <div class="flex flex-col gap-4 md:w-56 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="p-3 bg-ropi-bg text-ropi-primary rounded-lg shrink-0">
                        <Battery class="w-6 h-6" />
                    </div>
                    <p class="text-sm font-medium text-ropi-dark/70">Kapasitas Baterai</p>
                </div>

                <StatusChip class="self-start" :label="status.label" :badge-class="status.badgeClass" />

                <p class="text-xs flex items-center gap-1"
                    :class="trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-500' : 'text-ropi-dark/50'">
                    <span v-if="trend > 0">▲ Naik {{ trend }}% dari {{ history.length }} sampel terakhir</span>
                    <span v-else-if="trend < 0">▼ Turun {{ Math.abs(trend) }}% dari {{ history.length }} sampel
                        terakhir</span>
                    <span v-else>Stabil dalam {{ history.length }} sampel terakhir</span>
                </p>
            </div>

            <div class="hidden md:block w-px self-stretch bg-ropi-light"></div>

            <div class="flex-1 flex justify-center py-2">
                <div class="relative w-52 h-52 shrink-0" role="img" :aria-label="`Kapasitas baterai ${percent} persen`">
                    <canvas ref="canvasRef" class="w-full h-full"></canvas>

                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center text-center px-10 pointer-events-none">
                        <p class="text-xs text-ropi-dark/50">Baterai RoPi</p>
                        <p class="text-4xl font-bold text-ropi-dark mt-1">{{ percent }}%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>