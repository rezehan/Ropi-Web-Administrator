<script setup lang="ts">
import { ref, provide } from 'vue'
import {
    LayoutDashboard,
    AlertTriangle,
    UserRound,
    ClipboardList,
    BellRing,
    Menu,
    X
} from 'lucide-vue-next'
import SidebarNavItem from '@/components/layout/SidebarNavItem.vue'
import NotificationBell from '@/components/layout/NotificationBell.vue'
import ProfileMenu from '@/components/layout/ProfileMenu.vue'
import { useRopiRealtime } from '@/composables/useRopiRealtime'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const navItems = [
    { to: '/', label: 'Telemetri', icon: LayoutDashboard },
    { to: '/anomali', label: 'Riwayat Anomali', icon: AlertTriangle },
    { to: '/profil-anak', label: 'Profil Anak', icon: UserRound },
    { to: '/tindak-lanjut', label: 'Catatan Tindak Lanjut', icon: ClipboardList },
    { to: '/notifikasi', label: 'Notifikasi', icon: BellRing }
]

// Dipanggil sekali di sini (bukan di tiap halaman) supaya subscribe MQTT gak
// putus-nyambung tiap kali pindah rute. Semua halaman/komponen anak tinggal
// inject('ropiRealtime') untuk pakai data yang sama.
const ropiRealtime = useRopiRealtime()
provide('ropiRealtime', ropiRealtime)

// Sidebar hanya berupa drawer di layar kecil (< lg). Di layar besar selalu tampil,
// state ini diabaikan karena class translate di-override oleh breakpoint lg:.
const isSidebarOpen = ref(false)

function closeSidebar() {
    isSidebarOpen.value = false
}

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
    await authStore.logout()
    router.push('/login')
}
</script>

<template>
    <div class="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">

        <!-- Overlay gelap, hanya muncul di mobile saat sidebar terbuka -->
        <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/40 z-30 lg:hidden" @click="closeSidebar" />

        <!-- Sidebar: drawer di mobile, statis di desktop -->
        <aside
            class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white text-slate-500 flex flex-col shadow-xl transform transition-transform duration-200 ease-in-out lg:translate-x-0"
            :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
            <div class="p-6 flex items-center justify-between gap-3 border-b border-slate-700/50">
                <div class="flex items-center gap-3 min-w-0">
                    <img src="/ROPI.png" alt="RoPi Logo" width="50px">
                    <h1 class="text-xl font-bold text-slate-400 tracking-tight truncate">RoPi Admin</h1>
                </div>
                <button type="button" class="p-1.5 rounded-lg hover:bg-slate-100 lg:hidden" @click="closeSidebar">
                    <X class="w-5 h-5 text-slate-400" />
                </button>
            </div>

            <nav class="flex-1 p-4 space-y-2 overflow-y-auto" @click="closeSidebar">
                <SidebarNavItem v-for="item in navItems" :key="item.to" :to="item.to" :label="item.label"
                    :icon="item.icon" />
            </nav>

            <div class="p-4 text-xs text-slate-500 text-center border-t border-slate-700/50">
                v1.0.0 - RoPi Core
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header
                class="h-16 bg-white border-b border-slate-200 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 shrink-0 sm:rounded-b-lg sm:shadow-lg">
                <div class="flex items-center gap-3 min-w-0">
                    <button type="button" class="p-1.5 rounded-lg hover:bg-slate-100 lg:hidden shrink-0"
                        @click="isSidebarOpen = true">
                        <Menu class="w-5 h-5 text-slate-500" />
                    </button>
                    <h2 class="text-base sm:text-lg font-semibold text-slate-700 truncate">
                        {{ $route.meta.title }}
                    </h2>
                </div>

                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                    <NotificationBell />
                    <div class="hidden sm:block w-px h-6 bg-slate-200" />
                    <ProfileMenu name="Babinsa" role="Kel. Panakkukang" @logout="handleLogout" />
                </div>
            </header>

            <div class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
                <slot />
            </div>
        </main>
    </div>
</template>