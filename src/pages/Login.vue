<template>
    <div class="min-h-screen flex w-full bg-white">
        <!-- Sisi Kiri: Form Login -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24">
            <div class="w-full max-w-md space-y-8">
                <div class="text-center lg:text-left">
                    <h2 class="text-3xl font-extrabold text-gray-900">Selamat Datang</h2>
                    <p class="mt-2 text-sm text-gray-600">Silakan login untuk memantau dashboard Anda</p>
                </div>

                <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                    <div class="space-y-4">
                        <!-- Menggunakan reusable component FormField -->
                        <FormField id="username" label="Username" type="text" v-model="username"
                            placeholder="Masukkan username" />

                        <FormField id="password" label="Password" type="password" v-model="password"
                            placeholder="Masukkan password" />
                    </div>

                    <p v-if="errorMessage" class="text-sm text-red-600">
                        {{ errorMessage }}
                    </p>

                    <div>
                        <button type="submit" :disabled="isLoading"
                            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                            {{ isLoading ? 'Memproses...' : 'Masuk' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Sisi Kanan: Gambar Ilustrasi (Rasio 4:5) -->
        <div class="hidden lg:flex lg:w-1/2 h-full items-center justify-center bg-[#5bc4f4]">
            <img src="/side-login.svg" alt="Ilustrasi Login" class="w-full h-full object-contain p-0 m-0" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// Mengimpor reusable component yang ada di struktur foldermu
import FormField from '../components/ui/FormField.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    errorMessage.value = ''

    if (!username.value || !password.value) {
        errorMessage.value = 'Username dan password wajib diisi'
        return
    }

    isLoading.value = true
    try {
        const data = await authStore.login({
            username: username.value,
            password: password.value
        })

        if (data.success) {
            // Balik ke halaman yang tadinya mau diakses sebelum dilempar ke /login
            // (dari router guard), kalau tidak ada -> Dashboard.
            const redirectTo = (route.query.redirect as string) || '/'
            router.push(redirectTo)
        } else {
            errorMessage.value = data.message || 'Username atau password salah'
        }
    } catch {
        errorMessage.value = 'Gagal terhubung ke server, coba lagi'
    } finally {
        isLoading.value = false
    }
}
</script>