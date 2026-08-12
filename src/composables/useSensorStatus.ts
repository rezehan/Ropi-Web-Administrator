// composables/useSensorStatus.ts
export interface StatusMeta {
    label: string
    badgeClass: string
    barClass: string
    textClass: string
    gaugeColor: string
}

export const WASPADA_PERCENT = 40
export const ANOMALI_PERCENT = 75

export type RopiStatusAnomaliLike = 'normal' | 'waspada' | 'anomali'

const SENSOR_ERROR_META: StatusMeta = {
    label: 'Sensor Error',
    badgeClass: 'bg-slate-100 text-slate-500 border-slate-300',
    barClass: 'bg-slate-400',
    textClass: 'text-slate-500',
    gaugeColor: '#94a3b8', // slate-400
}

const ANOMALI_META: StatusMeta = {
    label: 'Anomali',
    badgeClass: 'bg-rose-50 text-rose-600 border-rose-200',
    barClass: 'bg-rose-500',
    textClass: 'text-rose-600',
    gaugeColor: '#f43f5e', // rose-500
}

const WASPADA_META: StatusMeta = {
    label: 'Waspada',
    badgeClass: 'bg-amber-50 text-amber-600 border-amber-200',
    barClass: 'bg-amber-500',
    textClass: 'text-amber-600',
    gaugeColor: '#f59e0b', // amber-500
}

const NORMAL_META: StatusMeta = {
    label: 'Normal',
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    barClass: 'bg-emerald-500',
    textClass: 'text-emerald-600',
    gaugeColor: '#10b981', // emerald-500
}

// Dipakai kartu per-sensor (mis. baterai) yang cuma punya satu angka persen
// tanpa status gabungan dari firmware.
export function getStatusMeta(percent: number, sensorOk = true): StatusMeta {
    if (!sensorOk) return SENSOR_ERROR_META
    if (percent >= ANOMALI_PERCENT) return ANOMALI_META
    if (percent >= WASPADA_PERCENT) return WASPADA_META
    return NORMAL_META
}

// Dipakai ChildStatusCard (status gabungan anak). Sumber kebenarannya adalah
// status_anomali dari firmware -- BUKAN re-threshold dari satu angka persen.
// Firmware gabungin flex+mic+gerakan pakai logika AND yang gak bisa
// direpresentasikan cuma pakai satu angka skala 0-100 (lihat penjelasan di
// useChildStatusFromMqtt.ts), jadi label & warna WAJIB ikut status_anomali asli.
export function getStatusMetaFromAnomali(statusAnomali: RopiStatusAnomaliLike, sensorOk = true): StatusMeta {
    if (!sensorOk) return SENSOR_ERROR_META
    if (statusAnomali === 'anomali') return ANOMALI_META
    if (statusAnomali === 'waspada') return WASPADA_META
    return NORMAL_META
}

export function getStatusGaugeColor(percent: number, sensorOk = true): string {
    return getStatusMeta(percent, sensorOk).gaugeColor
}

export function getStatusGaugeColorFromAnomali(statusAnomali: RopiStatusAnomaliLike, sensorOk = true): string {
    return getStatusMetaFromAnomali(statusAnomali, sensorOk).gaugeColor
}