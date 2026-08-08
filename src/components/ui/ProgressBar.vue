<script setup lang="ts">
defineProps<{
    percent: number
    barClass: string
}>()
</script>

<template>
    <div class="w-full bg-ropi-bg rounded-full h-1.5">
        <div class="h-1.5 rounded-full transition-all duration-300" :class="barClass"
            :style="{ width: Math.max(0, Math.min(100, percent)) + '%' }" />
    </div>
</template>