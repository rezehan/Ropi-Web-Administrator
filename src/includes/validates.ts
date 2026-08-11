import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

// 1. Definisikan Zod object murni
export const rawProfileSchema = z.object({
    child: z.object({
        nama: z.string().min(3, 'Nama anak wajib diisi (min. 3 karakter)'),
        usia: z.string().min(1, 'Usia wajib diisi'),
        sekolah: z.string().min(3, 'Nama sekolah wajib diisi'),
        alamat: z.string().min(5, 'Alamat tempat tinggal wajib diisi'),
        vestId: z.string()
    }),
    guardian: z.object({
        nama: z.string().min(3, 'Nama wali wajib diisi (min. 3 karakter)'),
        hubungan: z.string().min(1, 'Status hubungan wajib diisi'),
        telepon: z.string()
            .min(9, 'Nomor telepon tidak valid')
            .regex(/^[0-9+\-\s]+$/, 'Hanya angka yang diperbolehkan'),
        alamatDarurat: z.string().min(5, 'Alamat darurat wajib diisi')
    })
})

// 2. Export skema yang sudah dibungkus untuk VeeValidate
export const profileSchema = toTypedSchema(rawProfileSchema)

// 3. (PENTING) Export tipe datanya agar bisa dipakai di Vue
// Ini akan otomatis membuatkan interface seperti ChildData & GuardianData sebelumnya
export type ProfileFormValues = z.infer<typeof rawProfileSchema>