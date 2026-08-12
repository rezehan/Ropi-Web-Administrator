/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// Tambahan field custom di route meta (dipakai router/index.ts untuk guard login)
import 'vue-router'
declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        requiresAuth?: boolean
    }
}