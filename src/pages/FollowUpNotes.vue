<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserRound, Phone, Save, Pencil } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import FormField from '@/components/ui/FormField.vue'
import InfoRow from '@/components/ui/InfoRow.vue'

import { useForm } from 'vee-validate'
// Import schema dan tipe datanya dari file validates.ts Anda
import { profileSchema, type ProfileFormValues } from '@/includes/validates.ts'

// Tambahkan setFieldValue di sini
const { values, errors, handleSubmit, setFieldValue } = useForm<ProfileFormValues>({
    validationSchema: profileSchema,
    initialValues: {
        child: {
            nama: '',
            usia: '',
            alamat: '',
            sekolah: '',
            vestId: 'ROPI-001'
        },
        guardian: {
            nama: '',
            hubungan: 'Orang Tua',
            telepon: '',
            alamatDarurat: ''
        }
    }
})

const hasExistingData = computed(() => Boolean(values.child.nama && values.guardian.nama))
const isEditing = ref(!hasExistingData.value)

const isSaving = ref(false)
const savedRecently = ref(false)

const saveProfile = handleSubmit(async (formValues) => {
    isSaving.value = true
    try {
        // formValues di sini sudah sepenuhnya Type-Safe sesuai file validates.ts
        await new Promise((resolve) => setTimeout(resolve, 400)) // simulasi request

        savedRecently.value = true
        isEditing.value = false
        setTimeout(() => (savedRecently.value = false), 2000)
    } finally {
        isSaving.value = false
    }
})

function startEditing() {
    isEditing.value = true
}
</script>

<template>
    <form @submit.prevent="saveProfile" class="mx-auto space-y-6">

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
                        <p class="text-sm font-mono font-semibold text-slate-700">{{ values.child.vestId }}</p>
                    </div>
                </div>

                <div v-if="isEditing" class="space-y-4">
                    <div>
                        <!-- PERUBAHAN DI SINI -->
                        <FormField :model-value="values.child.nama"
                            @update:model-value="(val) => setFieldValue('child.nama', val)" label="Nama Anak"
                            placeholder="Nama lengkap anak" />
                        <p v-if="errors['child.nama']" class="text-red-500 text-xs mt-1">{{ errors['child.nama'] }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <FormField :model-value="values.child.usia"
                                @update:model-value="(val) => setFieldValue('child.usia', val)" label="Usia"
                                placeholder="cth: 8 tahun" />
                            <p v-if="errors['child.usia']" class="text-red-500 text-xs mt-1">{{ errors['child.usia'] }}
                            </p>
                        </div>
                        <div>
                            <FormField :model-value="values.child.sekolah"
                                @update:model-value="(val) => setFieldValue('child.sekolah', val)" label="Sekolah"
                                placeholder="Nama sekolah" />
                            <p v-if="errors['child.sekolah']" class="text-red-500 text-xs mt-1">{{
                                errors['child.sekolah'] }}</p>
                        </div>
                    </div>

                    <div>
                        <FormField :model-value="values.child.alamat"
                            @update:model-value="(val) => setFieldValue('child.alamat', val)" label="Alamat"
                            placeholder="Alamat lengkap tempat tinggal" />
                        <p v-if="errors['child.alamat']" class="text-red-500 text-xs mt-1">{{ errors['child.alamat'] }}
                        </p>
                    </div>
                </div>

                <div v-else>
                    <InfoRow label="Nama" :value="values.child.nama" />
                    <InfoRow label="Usia" :value="values.child.usia" />
                    <InfoRow label="Sekolah" :value="values.child.sekolah" />
                    <InfoRow label="Alamat" :value="values.child.alamat" />
                </div>
            </Card>

            <!-- Kontak Darurat -->
            <Card title="Kontak Darurat" subtitle="Dihubungi bila terjadi anomali">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Phone class="w-5 h-5 text-emerald-600" />
                    </div>

                    <a v-if="values.guardian.telepon" :href="`tel:${values.guardian.telepon}`"
                        class="text-sm font-medium text-ropi-primary hover:underline">
                        {{ values.guardian.telepon }}
                    </a>
                    <span v-else class="text-sm text-slate-400">Nomor belum diisi</span>
                </div>

                <div v-if="isEditing" class="space-y-4">
                    <div>
                        <FormField :model-value="values.guardian.nama"
                            @update:model-value="(val) => setFieldValue('guardian.nama', val)" label="Nama Wali"
                            placeholder="Nama orang tua / wali" />
                        <p v-if="errors['guardian.nama']" class="text-red-500 text-xs mt-1">{{ errors['guardian.nama']
                            }}</p>
                    </div>
                    <div>
                        <FormField :model-value="values.guardian.hubungan"
                            @update:model-value="(val) => setFieldValue('guardian.hubungan', val)" label="Hubungan"
                            placeholder="cth: Ibu, Ayah, Wali" />
                        <p v-if="errors['guardian.hubungan']" class="text-red-500 text-xs mt-1">{{
                            errors['guardian.hubungan'] }}</p>
                    </div>
                    <div>
                        <FormField :model-value="values.guardian.telepon"
                            @update:model-value="(val) => setFieldValue('guardian.telepon', val)" label="Nomor Telepon"
                            type="tel" placeholder="08xxxxxxxxxx" />
                        <p v-if="errors['guardian.telepon']" class="text-red-500 text-xs mt-1">{{
                            errors['guardian.telepon'] }}</p>
                    </div>
                    <div>
                        <FormField :model-value="values.guardian.alamatDarurat"
                            @update:model-value="(val) => setFieldValue('guardian.alamatDarurat', val)"
                            label="Alamat Darurat" placeholder="Alamat yang dituju saat darurat" />
                        <p v-if="errors['guardian.alamatDarurat']" class="text-red-500 text-xs mt-1">{{
                            errors['guardian.alamatDarurat'] }}</p>
                    </div>
                </div>

                <div v-else>
                    <InfoRow label="Nama" :value="values.guardian.nama" />
                    <InfoRow label="Hubungan" :value="values.guardian.hubungan" />
                    <InfoRow label="Telepon" :value="values.guardian.telepon" />
                    <InfoRow label="Alamat Darurat" :value="values.guardian.alamatDarurat" />
                </div>
            </Card>

        </div>

        <!-- Aksi -->
        <div class="flex items-center justify-end gap-3">
            <span v-if="savedRecently" class="text-sm text-emerald-600 font-medium">Data tersimpan</span>

            <button v-if="isEditing" type="submit" :disabled="isSaving"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ropi-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
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
    </form>
</template>