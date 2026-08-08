import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'
import Chart from 'chart.js/auto'
import type { Plugin } from 'chart.js'
import { getGaugeColorForPercent } from './useSensorStatus'

const GAUGE_TRACK_COLOR = '#e2e8f0'
const GAUGE_START_ANGLE = (135 * Math.PI) / 180 // radian, 0 = arah jam 3 (standar canvas)
const GAUGE_SWEEP_ANGLE = (270 * Math.PI) / 180

export function useBatteryGauge(targetPercent: Ref<number>) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    // Nilai yang benar-benar digambar di gauge — beranimasi menuju targetPercent,
    // bukan langsung sama dengan targetPercent (biar ada efek "mengisi").
    const displayPercent = ref(0)

    let chartInstance: Chart | null = null
    let animationFrameId: number | null = null

    const gaugePlugin: Plugin<'doughnut'> = {
        id: 'batteryGauge',
        afterDraw(chart) {
            const { ctx, chartArea } = chart
            const { left, right, top, bottom } = chartArea
            const centerX = (left + right) / 2
            const centerY = (top + bottom) / 2

            const radius = Math.min(right - left, bottom - top) / 2 - 6
            const lineWidth = radius * 0.28
            const arcRadius = radius - lineWidth / 2

            const percent = Math.max(0, Math.min(100, displayPercent.value))
            const valueEndAngle = GAUGE_START_ANGLE + (GAUGE_SWEEP_ANGLE * percent) / 100

            ctx.save()
            ctx.lineCap = 'round'
            ctx.lineWidth = lineWidth

            // Track penuh (kapasitas total, 0-100%)
            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, GAUGE_START_ANGLE, GAUGE_START_ANGLE + GAUGE_SWEEP_ANGLE)
            ctx.strokeStyle = GAUGE_TRACK_COLOR
            ctx.stroke()

            // Kapasitas terisi — warnanya ikut nilai animasi saat ini
            if (percent > 0) {
                ctx.beginPath()
                ctx.arc(centerX, centerY, arcRadius, GAUGE_START_ANGLE, valueEndAngle)
                ctx.strokeStyle = getGaugeColorForPercent(percent)
                ctx.stroke()
            }

            ctx.restore()
        },
    }

    function createChart() {
        if (!canvasRef.value) return
        chartInstance = new Chart(canvasRef.value, {
            type: 'doughnut',
            data: {
                // Dataset dummy — cuma alasan Chart.js butuh minimal 1 dataset.
                // Visualnya 100% digambar oleh gaugePlugin di atas.
                datasets: [{ data: [1], backgroundColor: 'transparent', borderWidth: 0 }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // animasi Chart.js dimatikan, kita animasikan manual lewat displayPercent
                events: [],
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
            },
            plugins: [gaugePlugin],
        })
    }

    function animateTo(target: number, duration = 1200) {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)

        const start = displayPercent.value
        const startTime = performance.now()

        function step(now: number) {
            const elapsed = now - startTime
            const t = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
            displayPercent.value = start + (target - start) * eased
            chartInstance?.draw()

            if (t < 1) {
                animationFrameId = requestAnimationFrame(step)
            } else {
                displayPercent.value = target
                chartInstance?.draw()
                animationFrameId = null
            }
        }

        animationFrameId = requestAnimationFrame(step)
    }

    // Tiap targetPercent berubah (misal update dari MQTT), animasikan ke nilai baru
    watch(targetPercent, (newVal) => animateTo(newVal))

    onMounted(() => {
        createChart()
        animateTo(targetPercent.value) // animasi awal: dari 0% naik ke nilai sekarang
    })

    onBeforeUnmount(() => {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
        chartInstance?.destroy()
        chartInstance = null
    })

    return { canvasRef, displayPercent }
}