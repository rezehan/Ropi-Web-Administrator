<!-- components/dashboard/ChildStatusCard.vue -->
<script setup lang="ts">
import { computed, toRef } from 'vue'
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-vue-next'
import StatusChip from '@/components/ui/StatusChip.vue'
import { useStatusGauge } from '@/composables/useStatusGauge'
import { getStatusMetaFromAnomali, type RopiStatusAnomaliLike } from '@/composables/useSensorStatus'

const props = withDefaults(defineProps<{
    percent: number
    history: number[]
    statusAnomali: RopiStatusAnomaliLike
    sensorOk?: boolean
}>(), {
    sensorOk: true,
})

// Label & warna SELALU dari statusAnomali (sumber kebenaran = firmware).
// percent cuma dipakai buat isian visual gauge.
const status = computed(() => getStatusMetaFromAnomali(props.statusAnomali, props.sensorOk))

const gaugeColor = computed<string | null>(() => status.value.gaugeColor)

const { canvasRef } = useStatusGauge(toRef(props, 'percent'), toRef(props, 'sensorOk'), gaugeColor)
// canvasRef DIPAKAI di template lewat ref="canvasRef" (baris <canvas> di bawah),
// tapi karena dia hasil destructure dari composable (bukan `const x = ref(...)`
// langsung), vue-tsc kadang gagal deteksi itu sebagai "terpakai" -> TS6133 palsu.
// `void` di sini cuma buat kasih tau TS var ini sengaja dipakai, tanpa efek runtime.
void canvasRef

const headerIcon = computed(() => {
    if (status.value.label === 'Sensor Error') return ShieldQuestion
    if (status.value.label === 'Normal') return ShieldCheck
    return ShieldAlert // Waspada & Anomali
})

// Trend = arah nilai sensor tertinggi (flex/mic/gerakan). history HARUS
// urutan kronologis (lama -> baru) — sudah dijamin dari useChildStatusFromMqtt.
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
                        <component :is="headerIcon" class="w-6 h-6" />
                    </div>
                    <p class="text-sm font-medium text-ropi-dark/70">Status Kondisi Anak</p>
                </div>

                <StatusChip class="self-start" :label="status.label" :badge-class="status.badgeClass" />

                <p class="text-xs flex items-center gap-1"
                    :class="trend > 0 ? 'text-rose-500' : trend < 0 ? 'text-emerald-600' : 'text-ropi-dark/50'">
                    <span v-if="trend > 0">▲ Meningkat {{ trend }}% dari {{ history.length }} sampel terakhir</span>
                    <span v-else-if="trend < 0">▼ Menurun {{ Math.abs(trend) }}% dari {{ history.length }} sampel
                        terakhir</span>
                    <span v-else>Stabil dalam {{ history.length }} sampel terakhir</span>
                </p>
            </div>

            <div class="hidden md:block w-px self-stretch bg-ropi-light"></div>

            <div class="flex-1 flex justify-center py-2">
                <div class="relative w-52 h-52 shrink-0" role="img"
                    :aria-label="`Status kondisi anak: ${status.label}, skor risiko ${percent} persen`">
                    <canvas ref="canvasRef" class="w-full h-full"></canvas>

                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none">
                        <p class="text-xs text-ropi-dark/50">Status Saat Ini</p>
                        <p class="text-2xl font-bold mt-1" :class="status.textClass">{{ status.label }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>