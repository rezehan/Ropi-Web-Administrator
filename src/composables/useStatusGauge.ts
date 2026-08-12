// composables/useStatusGauge.ts
import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'
import Chart from 'chart.js/auto'
import type { Plugin } from 'chart.js'
import { getStatusGaugeColor } from './useSensorStatus'

const GAUGE_TRACK_COLOR = '#e2e8f0'
const GAUGE_START_ANGLE = (135 * Math.PI) / 180
const GAUGE_SWEEP_ANGLE = (270 * Math.PI) / 180

export function useStatusGauge(
    targetPercent: Ref<number>,
    sensorOk: Ref<boolean> = ref(true),
    // Opsional. Kalau diisi, warna arc PAKAI INI langsung (mis. warna dari
    // status_anomali asli firmware lewat getStatusGaugeColorFromAnomali),
    // bukan dihitung ulang dari percent+sensorOk. Dipakai ChildStatusCard
    // biar warna arc gauge selalu konsisten sama badge & label status.
    colorOverride: Ref<string | null> = ref(null)
) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const displayPercent = ref(0)

    let chartInstance: Chart | null = null
    let animationFrameId: number | null = null

    const gaugePlugin: Plugin<'doughnut'> = {
        id: 'statusGauge',
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

            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, GAUGE_START_ANGLE, GAUGE_START_ANGLE + GAUGE_SWEEP_ANGLE)
            ctx.strokeStyle = GAUGE_TRACK_COLOR
            ctx.stroke()

            if (percent > 0) {
                ctx.beginPath()
                ctx.arc(centerX, centerY, arcRadius, GAUGE_START_ANGLE, valueEndAngle)
                ctx.strokeStyle = colorOverride.value ?? getStatusGaugeColor(percent, sensorOk.value)
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
                datasets: [{ data: [1], backgroundColor: 'transparent', borderWidth: 0 }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
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
            const eased = 1 - Math.pow(1 - t, 3)
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

    watch(targetPercent, (newVal) => animateTo(newVal))
    watch(sensorOk, () => chartInstance?.draw())
    watch(colorOverride, () => chartInstance?.draw())

    onMounted(() => {
        createChart()
        animateTo(targetPercent.value)
    })

    onBeforeUnmount(() => {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
        chartInstance?.destroy()
        chartInstance = null
    })

    return { canvasRef, displayPercent }
}