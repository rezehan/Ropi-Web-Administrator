import axiosClient from './Axiosclient.ts'

export interface LoginPayload {
    username: string
    password: string
}

export interface LoginUser {
    id: number
    username: string
}

export interface LoginResponse {
    success: boolean
    message: string
    user?: LoginUser
}

export interface CheckSessionResponse {
    authenticated: boolean
    user?: LoginUser
}

/**
 * Panggil endpoint login-web.php.
 * Sesi login disimpan lewat cookie (withCredentials di axiosClient),
 * jadi tidak perlu simpan token manual di localStorage.
 *
 * Contoh pakai di Login.vue:
 *   const { data } = await login({ username, password })
 *   if (data.success) router.push('/')
 */
export async function login(payload: LoginPayload) {
    return axiosClient.post<LoginResponse>('https://ropipkmkc.com/ropi/login-web.php', payload)
}

/**
 * Cek apakah cookie session yang dikirim browser masih valid.
 * Dipanggil authStore.checkSession() saat app pertama kali dibuka/refresh,
 * karena cookie httponly tidak bisa dibaca langsung dari JS.
 */
export async function checkSession() {
    return axiosClient.get<CheckSessionResponse>('https://ropipkmkc.com/ropi/check-session.php')
}

/** Hapus session di server (dipanggil saat klik tombol logout). */
export async function logout() {
    return axiosClient.post<{ success: boolean }>('https://ropipkmkc.com/ropi/logout.php')
}