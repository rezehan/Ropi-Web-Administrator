import { onMounted, onBeforeUnmount, type Ref } from 'vue'

// Menutup dropdown/popover otomatis saat user klik di luar elemen yang di-ref
export function useClickOutside(targetRef: Ref<HTMLElement | null>, onOutsideClick: () => void) {
    function handleClick(event: MouseEvent) {
        if (targetRef.value && !targetRef.value.contains(event.target as Node)) {
            onOutsideClick()
        }
    }

    onMounted(() => document.addEventListener('click', handleClick))
    onBeforeUnmount(() => document.removeEventListener('click', handleClick))
}