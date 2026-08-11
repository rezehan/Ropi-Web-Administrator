<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
    to: string
    label: string
    icon: Component
}>()
</script>

<template>
    <router-link :to="to" v-slot="{ isActive, navigate, href }" custom>
        <a :href="href" @click="navigate" :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm',
            isActive
                ? 'bg-linear-to-r from-[var(--color-ropi-primary)] via-[var(--color-ropi-primary)] to-[var(--color-ropi-dark)] text-white border border-emerald-500/20'
                : 'hover:bg-slate-100'
        ]">
            <component :is="icon" class="w-5 h-5" />
            <span class="font-medium">{{ label }}</span>
        </a>
    </router-link>
</template>