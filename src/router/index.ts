import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import AnomalyHistory from '../pages/AnomalyHistory.vue'
import ChildProfile from '../pages/ChildProfile.vue'
import FollowUpNotes from '../pages/FollowUpNotes.vue'
import NotificationSettings from '../pages/NotificationSettings.vue'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: 'Sistem Telemetri' }
    },
    {
        path: '/anomali',
        name: 'AnomalyHistory',
        component: AnomalyHistory,
        meta: { title: 'Log Insiden Keamanan' }
    },
    {
        path: '/profil-anak',
        name: 'ChildProfile',
        component: ChildProfile,
        meta: { title: 'Profil Anak Pengguna' }
    },
    {
        path: '/tindak-lanjut',
        name: 'FollowUpNotes',
        component: FollowUpNotes,
        meta: { title: 'Catatan Tindak Lanjut' }
    },
    {
        path: '/notifikasi',
        name: 'NotificationSettings',
        component: NotificationSettings,
        meta: { title: 'Pengaturan Notifikasi' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router