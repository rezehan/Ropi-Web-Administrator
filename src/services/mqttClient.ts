import mqtt, { type MqttClient, type IClientOptions } from 'mqtt'

// HiveMQ Cloud: MQTT-TLS ada di port 8883 (dipakai firmware/ESP32),
// tapi browser cuma bisa konek lewat WebSocket, jadi pakai port 8884 + path /mqtt.
const MQTT_URL = import.meta.env.VITE_MQTT_URL as string
const MQTT_USERNAME = import.meta.env.VITE_MQTT_USERNAME as string
const MQTT_PASSWORD = import.meta.env.VITE_MQTT_PASSWORD as string

let client: MqttClient | null = null

/**
 * Mengembalikan satu instance MQTT client yang dipakai bersama (singleton) di seluruh
 * aplikasi. Dipanggil pertama kali akan membuka koneksi; pemanggilan berikutnya
 * mengembalikan koneksi yang sama supaya tidak buka banyak socket sekaligus.
 *
 * Status koneksi di-log ke console (F12 -> Console) untuk memudahkan debug:
 * - Hijau = berhasil connect
 * - Merah = error koneksi
 */
export function getMqttClient(): MqttClient {
    if (client) return client

    const options: IClientOptions = {
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        // Suffix acak supaya tiap tab/sesi browser dapat clientId unik —
        // HiveMQ akan memutus sesi lama kalau ada clientId yang bentrok.
        clientId: `ropi-admin-${Math.random().toString(16).slice(2, 10)}`,
        clean: true,
        reconnectPeriod: 3000, // auto-retry tiap 3 detik, non-blocking
        connectTimeout: 10000,
        protocolVersion: 5
    }

    client = mqtt.connect(MQTT_URL, options)

    client.on('connect', () => {
        console.log('%c[MQTT] ✅ Terhubung ke broker HiveMQ', 'color: #22c55e; font-weight: bold')
    })

    client.on('error', (err) => {
        console.error('[MQTT] ❌ Connection error:', err.message)
    })

    return client
}

/** Tutup koneksi secara eksplisit, misalnya saat logout. */
export function disconnectMqtt() {
    client?.end(true)
    client = null
}

/** Helper publish, dipakai kalau admin perlu kirim perintah (mis. trigger capture kamera). */
export function publishMqtt(topic: string, payload: unknown, qos: 0 | 1 | 2 = 1) {
    getMqttClient().publish(topic, JSON.stringify(payload), { qos })
}