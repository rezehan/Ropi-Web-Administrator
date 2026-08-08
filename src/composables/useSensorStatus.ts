export interface StatusMeta {
    label: string
    badgeClass: string
    barClass: string
}

export const WASPADA_PERCENT = 40
export const ANOMALI_PERCENT = 75

export function getStatusMeta(percent: number, sensorOk = true): StatusMeta {
    if (!sensorOk) {
        return { label: 'Sensor Error', badgeClass: 'bg-slate-100 text-slate-500 border-slate-300', barClass: 'bg-slate-400' }
    }
    if (percent >= ANOMALI_PERCENT) {
        return { label: 'Anomali', badgeClass: 'bg-rose-50 text-rose-600 border-rose-200', barClass: 'bg-rose-500' }
    }
    if (percent >= WASPADA_PERCENT) {
        return { label: 'Waspada', badgeClass: 'bg-amber-50 text-amber-600 border-amber-200', barClass: 'bg-amber-500' }
    }
    return { label: 'Normal', badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200', barClass: 'bg-emerald-500' }
}

export function getBatteryStatusMeta(percent: number): StatusMeta {
    if (percent <= 15) {
        return { label: 'Kritis - Segera Isi', badgeClass: 'bg-rose-50 text-rose-600 border-rose-200', barClass: 'bg-rose-500' }
    }
    if (percent <= 30) {
        return { label: 'Baterai Rendah', badgeClass: 'bg-amber-50 text-amber-600 border-amber-200', barClass: 'bg-amber-500' }
    }
    return { label: 'Pemakaian Normal', badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200', barClass: 'bg-emerald-500' }
}

// Dipakai oleh gauge baterai untuk mewarnai arc per-frame saat animasi berjalan
export function getGaugeColorForPercent(percent: number): string {
    if (percent <= 15) return '#f43f5e' // rose-500
    if (percent <= 30) return '#f59e0b' // amber-500
    return '#10b981' // emerald-500
}