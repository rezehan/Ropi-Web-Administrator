<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Activity, Mic, Move } from 'lucide-vue-next'
import ChildStatusCard from '@/components/dashboard/ChildStatusCard.vue'
import { useChildStatusFromMqtt } from '@/composables/useChildStatusFromMqtt'
import SensorStatCard from '@/components/dashboard/SensorStatCard.vue'
import CameraFeedCard from '@/components/dashboard/CameraFeedCard.vue'
import LocationMapCard from '@/components/dashboard/LocationMapCard.vue'
import { useRopiRealtime } from '@/composables/useRopiRealtime'

// TODO: ganti jadi dinamis (mis. dari route param / device selector) kalau nanti
// ada lebih dari satu node RoPi aktif. Untuk sekarang di-hardcode sesuai
// MQTT_CLIENT_ID di secrets.h node yang sedang dipakai.
const DEVICE_ID = 'ropi-esp32-01'
const MAX_BATTERY_HISTORY = 20

const { latestAlarm, deviceStatus } = useRopiRealtime()

// --- Lokasi: cuma update posisi kalau GPS valid, biar marker gak lompat ke (0,0)
// tiap kali GPS sempat kehilangan fix. Default tetap dipertahankan sebagai
// fallback awal sebelum data pertama masuk. ---
const robotLocation = ref<[number, number]>([-5.1476, 119.4327])
watch(latestAlarm, (alarm) => {
    if (alarm?.gps_valid && alarm.latitude !== undefined && alarm.longitude !== undefined) {
        robotLocation.value = [alarm.latitude, alarm.longitude]
    }
})

const { percent, history, statusAnomali, sensorOk } = useChildStatusFromMqtt()

// --- Baterai: field ini datang dari topic "ropi/status", BUKAN dari payload
// telemetry — makanya diambil dari deviceStatus, bukan latestAlarm. Firmware
// ropi-esp32-01 yang kamu kirim kemarin belum publish ke topic ini sama sekali,
// jadi selama itu belum ditambahkan di firmware, batteryPercent akan diam di 0%
// (bukan berarti baterainya benar-benar kritis — cuma belum ada datanya). ---
const deviceBattery = computed(() => deviceStatus[DEVICE_ID]?.battery)
const batteryHistory = ref<number[]>([])
watch(deviceBattery, (val) => {
    if (val === undefined) return
    batteryHistory.value = [...batteryHistory.value, val].slice(-MAX_BATTERY_HISTORY)
})

// --- Sensor: langsung dari payload telemetry terbaru (ropi/{device_id}/telemetry) ---
const micPercent = computed(() => latestAlarm.value?.mic_percent ?? 0)
const gerakanPercent = computed(() => latestAlarm.value?.gerakan_percent ?? 0)
const flexPercent = computed(() => latestAlarm.value?.flex_percent ?? 0)
const flexSensorOk = computed(() => latestAlarm.value?.flex_sensor_ok ?? true)
</script>

<template>
    <div class="space-y-6">
        <!-- Baris 1: Kartu Baterai (Hero) -->
        <ChildStatusCard :percent="percent" :history="history" :status-anomali="statusAnomali" :sensor-ok="sensorOk" />

        <!-- Baris 2: Sensor Suara, Gerakan, Tekukan -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SensorStatCard :icon="Mic" label="Sensor Suara" :percent="micPercent" />
            <SensorStatCard :icon="Move" label="Sensor Gerakan" :percent="gerakanPercent" />
            <SensorStatCard :icon="Activity" label="Sensor Tekukan" :percent="flexPercent" :sensor-ok="flexSensorOk"
                unavailable-message="Sensor tidak terdeteksi / periksa wiring" />
        </div>

        <!-- Baris 3: Kamera & Peta -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div class="lg:col-span-2">
                <CameraFeedCard />
            </div>
            <div class="lg:col-span-2">
                <LocationMapCard :location="robotLocation" />
            </div>
        </div>
    </div>
</template>