// NOTE: file ini saya susun ulang berdasarkan payload ASLI dari firmware
// ropi-esp32-01 (secrets.h) supaya field-nya match persis. Kalau kamu sudah
// punya types/ropi.ts sendiri, tinggal merge bagian yang beda saja — jangan
// timpa mentah-mentah kalau ada field lain yang sudah dipakai di file lain
// (mis. types buat ESP32-CAM) yang tidak saya lihat di sini.

/** Event level dari topic "ropi/{device_id}/telemetry".
 *  Firmware node "ropi-esp32-01" SELALU kirim "telemetry" — event
 *  "bahaya_tarikan"/"bahaya_jatuh" disiapkan untuk varian firmware lain,
 *  belum pernah dikirim oleh node ini. Level bahaya yang REAL ada di
 *  field status_anomali, bukan di sini. */
export type RopiEvent = 'normal' | 'telemetry' | 'bahaya_tarikan' | 'bahaya_jatuh'

/** Level anomali sesuai threshold 3-tingkat di firmware (computeStatusAnomali). */
export type RopiStatusAnomali = 'normal' | 'waspada' | 'anomali'

/** Bentuk mentah JSON apa pun yang bisa datang dari topic-topic RoPi
 *  (node telemetry, capture_trigger, status, photo_status). Semua optional
 *  karena tiap topic cuma mengisi sebagian field ini. */
export interface RopiRawPayload {
    // identitas device — firmware TIDAK KONSISTEN: telemetry pakai "device",
    // capture_trigger pakai "device_id". Selalu ambil lewat pickDeviceId().
    device?: string
    device_id?: string

    event?: string
    count?: number
    ts?: number
    timestamp?: number

    // sensor flex
    flex?: number
    flex_percent?: number
    flex_sensor_ok?: boolean

    // sensor suara
    mic?: number
    mic_percent?: number

    // IMU
    accel_x?: number
    accel_y?: number
    accel_z?: number
    gyro_x?: number
    gyro_y?: number
    gyro_z?: number
    gerakan_percent?: number

    status_anomali?: string

    // GPS — gps_valid dikirim firmware sebagai 0/1 (number), bukan boolean
    gps_valid?: number | boolean
    latitude?: number
    longitude?: number
    satellites?: number

    // topic "ropi/status"
    battery?: number
    rssi?: number
    online?: boolean

    // topic "ropi/photo_status"
    success?: boolean
    photo_url?: string
    url?: string
}

/** Data telemetry yang sudah dinormalisasi, siap dipakai komponen Vue. */
export interface RopiAlarmPayload {
    device_id: string
    event: RopiEvent
    status_anomali: RopiStatusAnomali

    count?: number

    flex?: number
    flex_percent?: number
    flex_sensor_ok?: boolean

    mic?: number
    mic_percent?: number

    accel_x?: number
    accel_y?: number
    accel_z?: number
    gyro_x?: number
    gyro_y?: number
    gyro_z?: number
    gerakan_percent?: number

    gps_valid: boolean
    latitude?: number
    longitude?: number
    satellites?: number

    /** RAW dari firmware = millis() sejak ESP32 boot. BUKAN epoch time,
     *  jangan dipakai buat nampilin "waktu kejadian" di UI. */
    ts: number
    /** Date.now() saat pesan diterima browser — pakai ini untuk tampilan waktu. */
    received_at: number
}

export interface RopiStatusPayload {
    device_id: string
    battery?: number
    rssi?: number
    online: boolean
    ts: number
}

export interface RopiPhotoStatusPayload {
    device_id: string
    success: boolean
    photo_url?: string
    ts: number
}