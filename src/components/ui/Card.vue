<script setup lang="ts">
defineProps<{
    title?: string
    subtitle?: string
}>()
</script>

<template>
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div v-if="title" class="mb-4">
            <h3 class="text-base font-semibold text-slate-800">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-slate-400 mt-0.5">{{ subtitle }}</p>
        </div>
        <slot />
    </div>
</template>