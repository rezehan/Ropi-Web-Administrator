// composables/useChildStatusFromMqtt.ts
import { computed, type ComputedRef } from 'vue'
import { useRopiRealtime } from './useRopiRealtime'
import type { RopiStatusAnomali, RopiAlarmPayload } from '@/types/ropi'

const HISTORY_WINDOW = 20

/**
 * Jembatan antara data real-time MQTT (useRopiRealtime) dan props yang
 * dibutuhkan ChildStatusCard.vue.
 *
 * - statusAnomali diambil LANGSUNG dari field status_anomali firmware
 *   (bukan dihitung ulang dari angka persen) — lihat penjelasan di
 *   useSensorStatus.ts soal kenapa logika AND firmware gak bisa direduksi
 *   ke satu angka skala 0-100.
 * - percent cuma dipakai buat isian visual gauge, diambil dari nilai
 *   TERTINGGI antara flex/mic/gerakan persen — TIDAK dipakai buat label/warna.
 * - alarmHistory dari useRopiRealtime urutannya TERBARU-DULU (di-unshift).
 *   ChildStatusCard butuh urutan kronologis (lama -> baru) buat hitung tren,
 *   jadi di-reverse dulu di sini, lalu diambil N sampel terakhir saja.
 */
export function useChildStatusFromMqtt(deviceId?: string) {
    const { latestAlarm, alarmHistory } = useRopiRealtime()

    const relevantAlarm = computed(() => {
        if (!deviceId) return latestAlarm.value
        return latestAlarm.value?.device_id === deviceId ? latestAlarm.value : null
    })

    const relevantHistory = computed(() => {
        const list = deviceId
            ? alarmHistory.value.filter((a) => a.device_id === deviceId)
            : alarmHistory.value
        return [...list].reverse().slice(-HISTORY_WINDOW)
    })

    function sensorMaxPercent(a: RopiAlarmPayload): number {
        return Math.max(a.flex_percent ?? 0, a.mic_percent ?? 0, a.gerakan_percent ?? 0)
    }

    const percent: ComputedRef<number> = computed(() =>
        relevantAlarm.value ? sensorMaxPercent(relevantAlarm.value) : 0
    )

    const history: ComputedRef<number[]> = computed(() =>
        relevantHistory.value.map(sensorMaxPercent)
    )

    const statusAnomali: ComputedRef<RopiStatusAnomali> = computed(
        () => relevantAlarm.value?.status_anomali ?? 'normal'
    )

    // Cuma flex sensor yang punya flag OK eksplisit dari firmware. Default
    // true selagi belum ada data masuk sama sekali, biar gak nampilin
    // "Sensor Error" palsu pas dashboard baru dibuka.
    const sensorOk: ComputedRef<boolean> = computed(() => relevantAlarm.value?.flex_sensor_ok ?? true)

    return { percent, history, statusAnomali, sensorOk, latestAlarm: relevantAlarm }
}