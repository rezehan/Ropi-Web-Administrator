<script setup lang="ts">
defineProps<{
    label: string
    value: string
}>()
</script>

<template>
    <div class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
        <span class="text-sm text-slate-500">{{ label }}</span>
        <span class="text-sm font-medium text-slate-800">{{ value }}</span>
    </div>
</template>