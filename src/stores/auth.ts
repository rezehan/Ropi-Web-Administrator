import { defineStore } from 'pinia'
import {
    login as loginApi,
    checkSession as checkSessionApi,
    logout as logoutApi,
    type LoginPayload,
    type LoginUser
} from '@/api/Auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as LoginUser | null,
        isAuthenticated: false,
        // Sudah pernah checkSession() atau belum di sesi browser ini.
        // Router guard pakai flag ini supaya cuma nanya ke backend SEKALI
        // (bukan tiap pindah halaman) — kecuali habis login/logout.
        isChecked: false
    }),
    actions: {
        /** Dipanggil dari Login.vue. */
        async login(payload: LoginPayload) {
            const { data } = await loginApi(payload)
            if (data.success && data.user) {
                this.user = data.user
                this.isAuthenticated = true
            }
            this.isChecked = true
            return data
        },

        /** Dipanggil router guard saat app pertama kali dibuka / di-refresh. */
        async checkSession() {
            try {
                const { data } = await checkSessionApi()
                this.isAuthenticated = data.authenticated
                this.user = data.user ?? null
            } catch {
                // 401 (belum login) juga masuk sini karena axios nge-throw utk status error
                this.isAuthenticated = false
                this.user = null
            } finally {
                this.isChecked = true
            }
            return this.isAuthenticated
        },

        /** Dipanggil tombol logout di AppLayout.vue. */
        async logout() {
            try {
                await logoutApi()
            } finally {
                this.user = null
                this.isAuthenticated = false
                this.isChecked = true
            }
        }
    }
})