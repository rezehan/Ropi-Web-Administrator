<script setup lang="ts">
import { ref } from 'vue'
import { ShieldAlert, Info, Clock } from 'lucide-vue-next'
// Nantinya kita import axios dan dayjs di sini

// Data dummy sementara sebelum ada API
const logs = ref([
    { id: 1, type: 'CRITICAL', sensor: 'Gyroscope', message: 'Indikasi Fall Detection terpicu (Kemiringan > 60°)', timestamp: '2026-08-07T14:10:00' },
    { id: 2, type: 'WARNING', sensor: 'Ultrasonic', message: 'Objek mendekat terlalu cepat (< 10cm)', timestamp: '2026-08-07T13:45:22' },
    { id: 3, type: 'INFO', sensor: 'System', message: 'Koneksi ulang modul WiFi berhasil', timestamp: '2026-08-07T10:12:05' },
])
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Log Insiden Sistem</h3>
                <p class="text-sm text-slate-500">Merekam 50 anomali terakhir dari sensor_data</p>
            </div>
            <button
                class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                Refresh Data
            </button>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
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
                                <!-- Nanti bagian ini kita format dengan dayjs -->
                                {{ log.timestamp }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>