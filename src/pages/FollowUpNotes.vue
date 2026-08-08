<script setup lang="ts">
import { ref } from 'vue'
import { ClipboardList, Send } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

interface FollowUpNote {
    id: number
    catatan: string
    petugas: string
    tanggal: string
    status: 'diproses' | 'selesai'
}

// TODO: ganti dengan fetch ke ambil_catatan.php
const notes = ref<FollowUpNote[]>([])

const newNote = ref('')
const isSubmitting = ref(false)

async function submitNote() {
    if (!newNote.value.trim()) return

    isSubmitting.value = true
    try {
        // TODO: POST ke tambah_catatan.php
        notes.value.unshift({
            id: Date.now(),
            catatan: newNote.value.trim(),
            petugas: 'Babinsa',
            tanggal: new Date().toLocaleString('id-ID'),
            status: 'diproses'
        })
        newNote.value = ''
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            <Card title="Tambah Catatan Tindak Lanjut" subtitle="Catat hasil kunjungan atau koordinasi lapangan">
                <form class="flex flex-col gap-3" @submit.prevent="submitNote">
                    <textarea v-model="newNote" rows="5"
                        placeholder="Contoh: Sudah dilakukan kunjungan ke rumah, berkoordinasi dengan RT setempat..."
                        class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ropi-primary/30 focus:border-ropi-primary resize-none" />
                    <button type="submit" :disabled="isSubmitting || !newNote.trim()"
                        class="self-end inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ropi-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                        <Send class="w-4 h-4" />
                        {{ isSubmitting ? 'Menyimpan...' : 'Simpan Catatan' }}
                    </button>
                </form>
            </Card>

            <Card title="Riwayat Catatan">
                <EmptyState v-if="notes.length === 0" :icon="ClipboardList" title="Belum ada catatan"
                    description="Catatan tindak lanjut yang kamu tambahkan akan muncul di sini" />

                <ul v-else class="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    <li v-for="note in notes" :key="note.id" class="border border-slate-100 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs text-slate-400">{{ note.tanggal }} · {{ note.petugas }}</span>
                            <StatusBadge :status="note.status" />
                        </div>
                        <p class="text-sm text-slate-700 leading-relaxed">{{ note.catatan }}</p>
                    </li>
                </ul>
            </Card>

        </div>
    </div>
</template>