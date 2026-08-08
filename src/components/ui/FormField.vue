<script setup lang="ts">
withDefaults(defineProps<{
    label: string
    modelValue: string
    type?: string
    placeholder?: string
}>(), {
    type: 'text'
})

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <label class="block">
        <span class="text-sm text-slate-500 mb-1.5 block">{{ label }}</span>
        <input :type="type" :value="modelValue" :placeholder="placeholder"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ropi-primary/30 focus:border-ropi-primary transition-colors" />
    </label>
</template>