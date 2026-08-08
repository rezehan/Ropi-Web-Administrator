<script setup lang="ts">
import { Video } from 'lucide-vue-next'

withDefaults(defineProps<{
    streamUrl?: string
    isRecording?: boolean
}>(), {
    isRecording: true
})
</script>

<template>
    <div class="bg-white rounded-xl border border-ropi-light shadow-sm flex flex-col overflow-hidden h-full">
        <div class="px-5 py-4 border-b border-ropi-light/50 flex items-center justify-between bg-ropi-bg/30">
            <div class="flex items-center gap-2 text-ropi-dark font-semibold">
                <Video class="w-5 h-5 text-ropi-primary" />
                ESP32-CAM Live Feed (4:3)
            </div>
            <span v-if="isRecording"
                class="flex items-center gap-1.5 text-xs font-medium text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-200 animate-pulse">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span> REC
            </span>
        </div>

        <div class="flex-1 bg-slate-900 flex items-center justify-center p-3">
            <div
                class="relative w-full aspect-[4/3] max-h-[420px] bg-black border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                <img v-if="streamUrl" :src="streamUrl" class="w-full h-full object-contain"
                    alt="Live Stream ESP32-CAM" />

                <div v-else class="text-center text-slate-500 z-10">
                    <Video class="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Menunggu koneksi stream ESP32-CAM...</p>
                    <p class="text-xs mt-1 opacity-70">Field: 640x480 (VGA, rasio 4:3)</p>
                </div>

                <div class="absolute inset-0 pointer-events-none border-[1px] border-white/10 m-8 z-20">
                    <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/40"></div>
                    <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/40"></div>
                    <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/40"></div>
                    <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/40"></div>
                </div>
            </div>
        </div>
    </div>
</template>