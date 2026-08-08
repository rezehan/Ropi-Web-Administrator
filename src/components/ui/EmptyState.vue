<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
    icon: Component
    title: string
    description?: string
}>()
</script>

<template>
    <div class="flex flex-col items-center justify-center text-center py-12 px-4">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <component :is="icon" class="w-6 h-6 text-slate-400" />
        </div>
        <p class="text-sm font-medium text-slate-600">{{ title }}</p>
        <p v-if="description" class="text-sm text-slate-400 mt-1">{{ description }}</p>
    </div>
</template>