<script setup lang="ts">
import { computed, inject } from 'vue'
import { ShieldAlert, Info, Clock, AlertTriangle } from 'lucide-vue-next'
import type { RopiAlarmPayload } from '@/types/ropi'
import type { useRopiRealtime } from '@/composables/useRopiRealtime'

type LogLevel = 'CRITICAL' | 'WARNING' | 'INFO'

interface LogEntry {
    id: string
    type: LogLevel
    sensor: string
    message: string
    timestamp: number
}

// Disediakan sekali di AppLayout.vue lewat provide('ropiRealtime', useRopiRealtime()),
// jadi di sini tinggal inject, tidak buka subscription MQTT baru.
const ropiRealtime = inject<ReturnType<typeof useRopiRealtime>>('ropiRealtime')

/** Ubah satu payload alarm mentah dari MQTT jadi baris log yang siap ditampilkan. */
function mapAlarmToLog(alarm: RopiAlarmPayload, index: number): LogEntry {
    if (alarm.event === 'bahaya_jatuh') {
        return {
            id: `${alarm.device_id}-${alarm.ts}-${index}`,
            type: 'CRITICAL',
            sensor: 'Gyroscope',
            message: `Indikasi jatuh terdeteksi pada perangkat ${alarm.device_id}`,
            timestamp: alarm.ts
        }
    }

    if (alarm.event === 'bahaya_tarikan') {
        return {
            id: `${alarm.device_id}-${alarm.ts}-${index}`,
            type: 'CRITICAL',
            sensor: 'Sensor Tarikan',
            message: `Indikasi tarikan darurat terdeteksi pada perangkat ${alarm.device_id}`,
            timestamp: alarm.ts
        }
    }

    // Fallback untuk event lain yang belum ada mapping khusus (mis. event baru di masa depan).
    return {
        id: `${alarm.device_id}-${alarm.ts}-${index}`,
        type: 'INFO',
        sensor: 'System',
        message: `Event "${alarm.event}" diterima dari ${alarm.device_id}`,
        timestamp: alarm.ts
    }
}

// Riwayat Anomali cuma nampilin kejadian bahaya sungguhan, bukan heartbeat/telemetry rutin
// (event "normal" / "telemetry" sengaja di-skip di sini).
const logs = computed<LogEntry[]>(() => {
    const history = ropiRealtime?.alarmHistory.value ?? []
    return history
        .filter((alarm) => alarm.event === 'bahaya_jatuh' || alarm.event === 'bahaya_tarikan')
        .map(mapAlarmToLog)
})

/**
 * ts dari firmware kadang epoch detik, kadang epoch milidetik — nilai di bawah
 * 1e12 hampir pasti detik (epoch ms untuk tanggal sekarang sudah > 1.7 x 10^12).
 */
function formatTimestamp(ts: number): string {
    const ms = ts < 1e12 ? ts * 1000 : ts
    return new Date(ms).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'medium'
    })
}
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Log Insiden Sistem</h3>
                <p class="text-sm text-slate-500">
                    Merekam hingga 100 insiden anomali terakhir secara real-time via MQTT
                </p>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div v-if="logs.length === 0" class="py-16 text-center text-slate-500 text-sm">
                Belum ada anomali yang tercatat.
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                        <tr>
                            <th scope="col" class="px-6 py-4">Tingkat</th>
                            <th scope="col" class="px-6 py-4">Sensor/Modul</th>
                            <th scope="col" class="px-6 py-4 w-full">Deskripsi Anomali</th>
                            <th scope="col" class="px-6 py-4 text-right">Waktu Kejadian</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <span v-if="log.type === 'CRITICAL'"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                                    <ShieldAlert class="w-3.5 h-3.5" /> Kritis
                                </span>
                                <span v-else-if="log.type === 'WARNING'"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                                    <AlertTriangle class="w-3.5 h-3.5" /> Peringatan
                                </span>
                                <span v-else
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                    <Info class="w-3.5 h-3.5" /> Info
                                </span>
                            </td>
                            <td class="px-6 py-4 font-medium text-slate-700">{{ log.sensor }}</td>
                            <td class="px-6 py-4 text-slate-600 truncate max-w-xs">{{ log.message }}</td>
                            <td
                                class="px-6 py-4 text-right text-slate-500 font-mono text-xs flex items-center justify-end gap-2">
                                <Clock class="w-3.5 h-3.5 opacity-70" />
                                {{ formatTimestamp(log.timestamp) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>