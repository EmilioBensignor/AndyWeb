<template>
    <DefaultSection class="sticky top-0 left-0 z-[1] transition-opacity">
        <!-- Contenedor para video y fallback -->
        <div class="relative w-full h-screen">
            <!-- Video responsive con una sola versión -->
            <video ref="heroVideo" class="w-full h-screen object-cover" autoplay muted playsinline loop preload="auto">
                <!-- Fuente de video única -->
                <source src="/videos/hero/Andy-Loisch-Textil-Art-Desktop.mp4" type="video/mp4" />
                <!-- Fallback para navegadores que no soportan video -->
                <NuxtImg src="/videos/hero/Andy-Loisch-Textil-Art-Desktop.png" alt="Andy Loisch Textil Art"
                    class="w-full h-screen object-cover" />
            </video>
        </div>
    </DefaultSection>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Referencia al elemento de video
const heroVideo = ref(null)

// Función para manejar errores y fallbacks
const handleVideoError = () => {
    if (heroVideo.value) {
        // Si el video no se puede cargar, muestra la imagen de fallback
        heroVideo.value.style.display = 'none'
        // Busca la imagen dentro del video y la muestra
        const fallbackImg = heroVideo.value.querySelector('img')
        if (fallbackImg) {
            fallbackImg.style.display = 'block'
        }
    }
}

// Función para optimizar la reproducción en dispositivos móviles
const optimizeMobilePlayback = () => {
    if (!heroVideo.value) return

    // Detectar dispositivos móviles
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
        heroVideo.value.addEventListener('canplay', () => {
            // Asegurarse de que el video se reproduzca tan pronto como sea posible
            heroVideo.value.play().catch(err => {
                console.log('Reproducción automática bloqueada:', err)
                handleVideoError()
            })
        })

        // Opcionalmente, detener el video cuando no está visible para ahorrar batería
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                heroVideo.value.pause()
            } else {
                heroVideo.value.play().catch(err => console.log('Error al reanudar:', err))
            }
        })
    }
}

onMounted(() => {
    if (heroVideo.value) {
        // Añadir event listener para errores
        heroVideo.value.addEventListener('error', handleVideoError)

        // Optimizar para móviles
        optimizeMobilePlayback()

        // Intentar reproducir el video
        heroVideo.value.play().catch(err => {
            console.log('Error de reproducción:', err)
            handleVideoError()
        })
    }
})
</script>