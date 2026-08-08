<script setup lang="ts">
defineProps<{
    label: string
    badgeClass: string
}>()
</script>

<template>
    <span :class="['text-xs font-semibold px-2 py-1 rounded-md border', badgeClass]">
        {{ label }}
    </span>
</template>