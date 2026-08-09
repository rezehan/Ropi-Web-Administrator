import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { getMqttClient, publishMqtt } from '@/services/mqttClient'
import type {
    RopiAlarmPayload,
    RopiStatusPayload,
    RopiPhotoStatusPayload,
    RopiRawPayload,
    RopiEvent
} from '@/types/ropi'

// Topic DISESUAIKAN dengan firmware (secrets.h), bukan skema ideal ropi/{device_id}/xxx:
// - Status SEMUA device (node & cam) dipublish rata ke "ropi/status" — device_id
//   dibedakan lewat field di dalam payload, BUKAN lewat path topic.
// - Telemetry node dipublish ke "ropi/{device_id}/telemetry" (bukan "/alarm").
// - Status hasil foto CAM dipublish ke "ropi/photo_status".
// - "ropi/capture_trigger" dipakai buat MENYURUH cam ambil foto (publish, bukan subscribe).
const STATUS_TOPIC = 'ropi/status'
const TELEMETRY_TOPIC = 'ropi/+/telemetry'
const PHOTO_STATUS_TOPIC = 'ropi/photo_status'
const CAPTURE_TRIGGER_TOPIC = 'ropi/capture_trigger'
const MAX_HISTORY = 100

const VALID_EVENTS: RopiEvent[] = ['normal', 'telemetry', 'bahaya_tarikan', 'bahaya_jatuh']

/** Ambil device id dari payload apa pun variasi nama fieldnya. */
function pickDeviceId(raw: RopiRawPayload): string {
    return raw.device_id ?? raw.device ?? 'unknown-device'
}

/** Ambil timestamp, terima "ts" atau "timestamp", fallback ke waktu sekarang. */
function pickTimestamp(raw: RopiRawPayload): number {
    return raw.ts ?? raw.timestamp ?? Date.now()
}

function normalizeTelemetry(raw: RopiRawPayload): RopiAlarmPayload {
    const event = VALID_EVENTS.includes(raw.event as RopiEvent) ? (raw.event as RopiEvent) : 'normal'

    if (raw.event && event === 'normal' && raw.event !== 'normal') {
        // Event dari firmware belum dikenal di RopiEvent — tetap ditampilkan sebagai
        // "normal" biar UI gak crash, tapi di-log biar gampang ketauan & bisa
        // ditambahin ke enum kalau memang valid.
        console.warn('[RoPi] Event telemetry tidak dikenal, fallback ke "normal":', raw.event, raw)
    }

    return {
        device_id: pickDeviceId(raw),
        event,
        status_anomali: raw.status_anomali ?? (event === 'bahaya_tarikan' || event === 'bahaya_jatuh'),
        gps_valid: raw.gps_valid ?? false,
        latitude: raw.latitude,
        longitude: raw.longitude,
        satellites: raw.satellites,
        ts: pickTimestamp(raw)
    }
}

function normalizeStatus(raw: RopiRawPayload): RopiStatusPayload {
    return {
        device_id: pickDeviceId(raw),
        battery: raw.battery,
        rssi: raw.rssi,
        online: raw.online ?? false,
        ts: pickTimestamp(raw)
    }
}

function normalizePhotoStatus(raw: RopiRawPayload): RopiPhotoStatusPayload {
    return {
        device_id: pickDeviceId(raw),
        success: raw.success ?? true,
        photo_url: raw.photo_url ?? raw.url,
        ts: pickTimestamp(raw)
    }
}

/**
 * Subscribe ke semua topic RoPi (node + cam) sesuai skema firmware asli,
 * lalu expose data terbaru secara reaktif — sudah dinormalisasi jadi bentuk
 * konsisten meskipun payload mentahnya bervariasi antar firmware/device.
 */
export function useRopiRealtime() {
    const latestAlarm = ref<RopiAlarmPayload | null>(null)
    const alarmHistory = ref<RopiAlarmPayload[]>([])
    const deviceStatus = reactive<Record<string, RopiStatusPayload>>({})
    const latestPhoto = ref<RopiPhotoStatusPayload | null>(null)

    const client = getMqttClient()

    function handleMessage(topic: string, payloadBuffer: Uint8Array) {
        let raw: RopiRawPayload
        try {
            raw = JSON.parse(payloadBuffer.toString())
        } catch (err) {
            console.error('[MQTT] Payload bukan JSON valid:', topic, err)
            return
        }

        if (topic.endsWith('/telemetry')) {
            const telemetry = normalizeTelemetry(raw)
            latestAlarm.value = telemetry
            alarmHistory.value = [telemetry, ...alarmHistory.value].slice(0, MAX_HISTORY)
            return
        }

        if (topic === STATUS_TOPIC) {
            const status = normalizeStatus(raw)
            deviceStatus[status.device_id] = status
            return
        }

        if (topic === PHOTO_STATUS_TOPIC) {
            latestPhoto.value = normalizePhotoStatus(raw)
            return
        }
    }

    /** Suruh ESP32-CAM ambil foto sekarang juga. */
    function triggerCapture() {
        publishMqtt(CAPTURE_TRIGGER_TOPIC, { requested_at: Date.now() }, 1)
    }

    onMounted(() => {
        client.subscribe(
            [STATUS_TOPIC, TELEMETRY_TOPIC, PHOTO_STATUS_TOPIC],
            { qos: 1 },
            (err) => {
                if (err) console.error('[MQTT] Gagal subscribe:', err)
            }
        )
        client.on('message', handleMessage)
    })

    onUnmounted(() => {
        client.off('message', handleMessage)
        client.unsubscribe([STATUS_TOPIC, TELEMETRY_TOPIC, PHOTO_STATUS_TOPIC])
    })

    return { latestAlarm, alarmHistory, deviceStatus, latestPhoto, triggerCapture }
}