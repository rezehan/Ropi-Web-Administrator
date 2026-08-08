<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { UserRound, Phone, Save, Pencil } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import FormField from '@/components/ui/FormField.vue'
import InfoRow from '@/components/ui/InfoRow.vue'

interface ChildData {
    nama: string
    usia: string
    alamat: string
    sekolah: string
    vestId: string
}

interface GuardianData {
    nama: string
    hubungan: string
    telepon: string
    alamatDarurat: string
}

// TODO: ganti dengan fetch ke ambil_profil.php saat backend siap
const child = reactive<ChildData>({
    nama: '',
    usia: '',
    alamat: '',
    sekolah: '',
    vestId: 'ROPI-001'
})

const guardian = reactive<GuardianData>({
    nama: '',
    hubungan: 'Orang Tua',
    telepon: '',
    alamatDarurat: ''
})

// Kalau data anak & wali masih kosong (belum pernah diisi), langsung tampilkan
// form isian. Kalau sudah ada datanya, tampilkan mode lihat (read-only) dulu.
const hasExistingData = computed(() => Boolean(child.nama && guardian.nama))
const isEditing = ref(!hasExistingData.value)

const isSaving = ref(false)
const savedRecently = ref(false)

async function saveProfile() {
    isSaving.value = true
    try {
        // TODO: POST ke simpan_profil.php dengan payload { child, guardian }
        await new Promise((resolve) => setTimeout(resolve, 400)) // simulasi request

        savedRecently.value = true
        isEditing.value = false
        setTimeout(() => (savedRecently.value = false), 2000)
    } finally {
        isSaving.value = false
    }
}

function startEditing() {
    isEditing.value = true
}
</script>

<template>
    <div class="mx-auto space-y-6">

        <!-- Banner ajakan isi data, hanya muncul kalau memang belum pernah diisi -->
        <div v-if="!hasExistingData && isEditing"
            class="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg">
            <UserRound class="w-5 h-5 shrink-0" />
            Data anak dan kontak darurat belum diisi. Lengkapi form di bawah ini terlebih dahulu.
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Data Anak -->
            <Card title="Data Anak Pengguna" subtitle="Informasi identitas pemilik vest RoPi">
                <div class="flex items-center gap-4 mb-5">
                    <div class="w-16 h-16 rounded-full bg-ropi-primary/10 flex items-center justify-center shrink-0">
                        <UserRound class="w-8 h-8 text-ropi-primary" />
                    </div>
                    <div>
                        <p class="text-xs text-slate-400">ID Perangkat</p>
                        <p class="text-sm font-mono font-semibold text-slate-700">{{ child.vestId }}</p>
                    </div>
                </div>

                <!-- Mode isi form -->
                <div v-if="isEditing" class="space-y-4">
                    <FormField v-model="child.nama" label="Nama Anak" placeholder="Nama lengkap anak" />

                    <div class="grid grid-cols-2 gap-4">
                        <FormField v-model="child.usia" label="Usia" placeholder="cth: 8 tahun" />
                        <FormField v-model="child.sekolah" label="Sekolah" placeholder="Nama sekolah" />
                    </div>

                    <FormField v-model="child.alamat" label="Alamat" placeholder="Alamat lengkap tempat tinggal" />
                </div>

                <!-- Mode lihat (read-only) -->
                <div v-else>
                    <InfoRow label="Nama" :value="child.nama" />
                    <InfoRow label="Usia" :value="child.usia" />
                    <InfoRow label="Sekolah" :value="child.sekolah" />
                    <InfoRow label="Alamat" :value="child.alamat" />
                </div>
            </Card>

            <!-- Kontak Darurat -->
            <Card title="Kontak Darurat" subtitle="Dihubungi bila terjadi anomali">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Phone class="w-5 h-5 text-emerald-600" />
                    </div>


                    <a v-if="guardian.telepon" :href="`tel:${guardian.telepon}`"
                        class="text-sm font-medium text-ropi-primary hover:underline">
                        {{ guardian.telepon }}
                    </a>
                    <span v-else class="text-sm text-slate-400">Nomor belum diisi</span>
                </div>

                <!-- Mode isi form -->
                <div v-if="isEditing" class="space-y-4">
                    <FormField v-model="guardian.nama" label="Nama Wali" placeholder="Nama orang tua / wali" />
                    <FormField v-model="guardian.hubungan" label="Hubungan" placeholder="cth: Ibu, Ayah, Wali" />
                    <FormField v-model="guardian.telepon" label="Nomor Telepon" type="tel" placeholder="08xxxxxxxxxx" />
                    <FormField v-model="guardian.alamatDarurat" label="Alamat Darurat"
                        placeholder="Alamat yang dituju saat darurat" />
                </div>

                <!-- Mode lihat (read-only) -->
                <div v-else>
                    <InfoRow label="Nama" :value="guardian.nama" />
                    <InfoRow label="Hubungan" :value="guardian.hubungan" />
                    <InfoRow label="Telepon" :value="guardian.telepon" />
                    <InfoRow label="Alamat Darurat" :value="guardian.alamatDarurat" />
                </div>
            </Card>

        </div>

        <!-- Aksi -->
        <div class="flex items-center justify-end gap-3">
            <span v-if="savedRecently" class="text-sm text-emerald-600 font-medium">Data tersimpan</span>

            <button v-if="isEditing" type="button" :disabled="isSaving"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ropi-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                @click="saveProfile">
                <Save class="w-4 h-4" />
                {{ isSaving ? 'Menyimpan...' : 'Simpan Data' }}
            </button>

            <button v-else type="button"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                @click="startEditing">
                <Pencil class="w-4 h-4" />
                Edit Data
            </button>
        </div>
    </div>
</template>