/** Format unix timestamp (detik) jadi teks relatif berbahasa Indonesia, mis. "5 menit lalu". */
export function formatRelativeTime(tsSeconds: number): string {
    const diffMs = Date.now() - tsSeconds * 1000
    const diffMin = Math.floor(diffMs / 60000)

    if (diffMin < 1) return 'baru saja'
    if (diffMin < 60) return `${diffMin} menit lalu`

    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} jam lalu`

    const diffDay = Math.floor(diffHour / 24)
    return `${diffDay} hari lalu`
}