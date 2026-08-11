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

export function getStatusMeta(percent: number, sensorOk = true): StatusMeta {
    if (!sensorOk) {
        return {
            label: 'Sensor Error',
            badgeClass: 'bg-slate-100 text-slate-500 border-slate-300',
            barClass: 'bg-slate-400',
            textClass: 'text-slate-500',
            gaugeColor: '#94a3b8', // slate-400
        }
    }
    if (percent >= ANOMALI_PERCENT) {
        return {
            label: 'Anomali',
            badgeClass: 'bg-rose-50 text-rose-600 border-rose-200',
            barClass: 'bg-rose-500',
            textClass: 'text-rose-600',
            gaugeColor: '#f43f5e', // rose-500
        }
    }
    if (percent >= WASPADA_PERCENT) {
        return {
            label: 'Waspada',
            badgeClass: 'bg-amber-50 text-amber-600 border-amber-200',
            barClass: 'bg-amber-500',
            textClass: 'text-amber-600',
            gaugeColor: '#f59e0b', // amber-500
        }
    }
    return {
        label: 'Normal',
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        barClass: 'bg-emerald-500',
        textClass: 'text-emerald-600',
        gaugeColor: '#10b981', // emerald-500
    }
}

// Dipakai oleh gauge status anak (kartu hero) untuk mewarnai arc per-frame saat animasi
// berjalan. Cuma ngewrap getStatusMeta biar warna gauge, badge, dan teks selalu konsisten
// tanpa duplikasi threshold di banyak tempat.
export function getStatusGaugeColor(percent: number, sensorOk = true): string {
    return getStatusMeta(percent, sensorOk).gaugeColor
}