<script setup lang="ts">
import { ref } from 'vue'
import { Activity, Mic, Move } from 'lucide-vue-next'
import BatteryGaugeCard from '@/components/dashboard/BatteryGaugeCard.vue'
import SensorStatCard from '@/components/dashboard/SensorStatCard.vue'
import CameraFeedCard from '@/components/dashboard/CameraFeedCard.vue'
import LocationMapCard from '@/components/dashboard/LocationMapCard.vue'

// --- Data sensor (nanti di-bind ke payload MQTT topic telemetry) ---
const robotLocation = ref<[number, number]>([-5.1476, 119.4327])

const batteryPercent = ref(84)
const batteryHistory = ref<number[]>([
    78, 79, 80, 79, 81, 82, 81, 83, 82, 84,
    85, 84, 85, 86, 85, 84, 85, 86, 85, 84,
])

const micPercent = ref(0)
const gerakanPercent = ref(0)
const flexPercent = ref(0)
const flexSensorOk = ref(true)
</script>

<template>
    <div class="space-y-6">
        <!-- Baris 1: Kartu Baterai (Hero) -->
        <BatteryGaugeCard :percent="batteryPercent" :history="batteryHistory" />

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