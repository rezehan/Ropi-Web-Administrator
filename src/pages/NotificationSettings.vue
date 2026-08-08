<script setup lang="ts">
import { reactive } from 'vue'
import { Bell } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'

const settings = reactive({
    anomaliPush: true,
    waspadaPush: true,
    baterai: true,
    whatsapp: false,
    email: false
})

function saveSettings() {
    // TODO: POST ke simpan_notifikasi.php
    console.log('Settings disimpan:', settings)
}
</script>

<template>
    <div class="max-w-3xl mx-auto space-y-6">
        <Card title="Preferensi Notifikasi" subtitle="Atur kapan kamu ingin menerima peringatan">
            <ToggleSwitch v-model="settings.anomaliPush" label="Notifikasi Anomali"
                description="Alert push saat status berubah menjadi Anomali" />
            <ToggleSwitch v-model="settings.waspadaPush" label="Notifikasi Waspada"
                description="Alert push saat status berubah menjadi Waspada" />
            <ToggleSwitch v-model="settings.baterai" label="Baterai Lemah"
                description="Peringatan saat baterai vest di bawah 20%" />
            <ToggleSwitch v-model="settings.whatsapp" label="Notifikasi WhatsApp"
                description="Kirim juga peringatan ke nomor WhatsApp terdaftar" />
            <ToggleSwitch v-model="settings.email" label="Notifikasi Email"
                description="Kirim juga peringatan ke email terdaftar" />

            <div class="pt-4 flex justify-end">
                <button type="button"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ropi-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    @click="saveSettings">
                    <Bell class="w-4 h-4" />
                    Simpan Pengaturan
                </button>
            </div>
        </Card>
    </div>
</template>