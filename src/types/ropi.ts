// Event yang mungkin dikirim ESP node lewat topic ropi/{device_id}/telemetry.
// "telemetry" ditambahkan karena firmware ternyata publish heartbeat rutin
// dengan event ini di topic yang sama dengan alarm sungguhan — bukan cuma
// 'normal' | 'bahaya_tarikan' | 'bahaya_jatuh' seperti definisi lama.
export type RopiEvent = 'normal' | 'telemetry' | 'bahaya_tarikan' | 'bahaya_jatuh'

export interface RopiAlarmPayload {
    device_id: string
    event: RopiEvent
    status_anomali: boolean
    gps_valid: boolean
    latitude?: number
    longitude?: number
    satellites?: number
    ts: number
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

/**
 * Bentuk mentah yang benar-benar dikirim di wire (belum tentu sama persis
 * dengan tipe di atas). Field boleh nggak ada / beda nama tergantung firmware
 * mana yang publish. JANGAN dipakai langsung ke UI — selalu lewat salah satu
 * fungsi normalize di useRopiRealtime.ts dulu.
 */
export interface RopiRawPayload {
    device_id?: string
    device?: string
    event?: string
    status_anomali?: boolean
    gps_valid?: boolean
    latitude?: number
    longitude?: number
    satellites?: number
    online?: boolean
    battery?: number
    rssi?: number
    success?: boolean
    photo_url?: string
    url?: string
    ts?: number
    timestamp?: number
    // Field lain yang belum diketahui (mis. "count") tetap tersimpan di sini
    // dan aman diakses lewat raw['nama_field'] tanpa bikin TypeScript error.
    [key: string]: unknown
}