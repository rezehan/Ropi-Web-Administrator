<script setup lang="ts">
defineProps<{
    modelValue: boolean
    label: string
    description?: string
}>()

defineEmits<{
    'update:modelValue': [value: boolean]
}>()
</script>

<template>
    <div class="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
        <div>
            <p class="text-sm font-medium text-slate-800">{{ label }}</p>
            <p v-if="description" class="text-sm text-slate-400 mt-0.5">{{ description }}</p>
        </div>
        <button type="button" role="switch" :aria-checked="modelValue"
            class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
            :class="modelValue ? 'bg-ropi-primary' : 'bg-slate-200'" @click="$emit('update:modelValue', !modelValue)">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="modelValue ? 'translate-x-6' : 'translate-x-1'" />
        </button>
    </div>
</template>