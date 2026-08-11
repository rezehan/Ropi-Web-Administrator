<script setup lang="ts">
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import { MapPin } from 'lucide-vue-next'

withDefaults(defineProps<{
    location: [number, number]
    accuracyMeters?: number
    fixStatus?: string
}>(), {
    accuracyMeters: 2.5,
    fixStatus: '3D Fix (Satelit)'
})

// v-model:zoom bawaan komponen, default 16 — dipertahankan biar user tetap
// bisa zoom in/out di peta seperti sebelumnya (butuh Vue 3.4+)
const zoom = defineModel<number>('zoom', { default: 16 })
</script>

<template>
    <div class="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden h-full">
        <div class="px-5 py-4 border-b border-ropi-light/50 flex items-center gap-2 text-ropi-dark font-semibold">
            <MapPin class="w-5 h-5 text-ropi-primary" />
            Pelacakan Lokasi (Leaflet)
        </div>

        <div class="flex-1 flex flex-col p-5 gap-4">
            <div
                class="flex-1 bg-ropi-bg rounded-lg border border-ropi-light relative overflow-hidden min-h-[420px] z-0">
                <l-map v-model:zoom="zoom" :center="location" :use-global-leaflet="false">
                    <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                        name="OpenStreetMap"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                    <l-marker :lat-lng="location">
                        <l-popup>
                            <div class="text-sm font-semibold text-ropi-dark text-center">
                                Posisi RoPi Saat Ini
                            </div>
                        </l-popup>
                    </l-marker>
                </l-map>
            </div>

            <div class="bg-ropi-bg/50 rounded-lg p-3 space-y-2">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-ropi-dark/70 font-medium">Latitude:</span>
                    <span class="text-ropi-dark font-mono font-bold">{{ location[0].toFixed(4) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-ropi-dark/70 font-medium">Longitude:</span>
                    <span class="text-ropi-dark font-mono font-bold">{{ location[1].toFixed(4) }}</span>
                </div>
                <div class="pt-2 mt-2 border-t border-ropi-light/50 flex justify-between items-center text-xs">
                    <span class="text-ropi-dark/60">Akurasi: &plusmn;{{ accuracyMeters }}m</span>
                    <span class="text-emerald-600 font-semibold">{{ fixStatus }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Global, bukan scoped — marker Leaflet dirender di luar shadow/scope komponen ini */
.leaflet-default-icon-path {
    background-image: url(https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png);
}
</style>