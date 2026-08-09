import { ref, onMounted, onUnmounted } from 'vue'
import { getMqttClient } from '@/services/mqttClient'

export type MqttStatus = 'connecting' | 'connected' | 'reconnecting' | 'offline' | 'error'

/** Status koneksi MQTT reaktif, dipakai misalnya untuk badge "Live" di header. */
export function useMqttConnection() {
    const status = ref<MqttStatus>('connecting')
    const client = getMqttClient()

    const onConnect = () => (status.value = 'connected')
    const onReconnect = () => (status.value = 'reconnecting')
    const onOffline = () => (status.value = 'offline')
    const onError = () => (status.value = 'error')

    onMounted(() => {
        client.on('connect', onConnect)
        client.on('reconnect', onReconnect)
        client.on('offline', onOffline)
        client.on('error', onError)
    })

    onUnmounted(() => {
        client.off('connect', onConnect)
        client.off('reconnect', onReconnect)
        client.off('offline', onOffline)
        client.off('error', onError)
    })

    return { status }
}
