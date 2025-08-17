<template>
    <DefaultSection class="sticky top-0 left-0 z-[1] transition-opacity">
        <div class="relative w-full h-screen">
            <video ref="mobileVideo" class="w-full h-screen object-cover"
                :class="{ 'hidden': currentDevice !== 'mobile' }" autoplay muted playsinline loop preload="auto"
                @error="handleVideoError('mobile')">
                <source src="/videos/hero/Andy-Loisch-Textil-Art-Mobile.mp4" type="video/mp4" />
                <NuxtImg src="/videos/hero/Andy-Loisch-Textil-Art-Mobile.png" alt="Andy Loisch Textil Art"
                    class="w-full h-screen object-cover" />
            </video>

            <video ref="tabletVideo" class="w-full h-screen object-cover"
                :class="{ 'hidden': currentDevice !== 'tablet' }" autoplay muted playsinline loop preload="auto"
                @error="handleVideoError('tablet')">
                <source src="/videos/hero/Andy-Loisch-Textil-Art-Tablet.mp4" type="video/mp4" />
                <NuxtImg src="/videos/hero/Andy-Loisch-Textil-Art-Tablet.png" alt="Andy Loisch Textil Art"
                    class="w-full h-screen object-cover" />
            </video>

            <video ref="desktopVideo" class="w-full h-screen object-cover"
                :class="{ 'hidden': currentDevice !== 'desktop' }" autoplay muted playsinline loop preload="auto"
                @error="handleVideoError('desktop')">
                <source src="/videos/hero/Andy-Loisch-Textil-Art-Desktop.mp4" type="video/mp4" />
                <NuxtImg src="/videos/hero/Andy-Loisch-Textil-Art-Desktop.png" alt="Andy Loisch Textil Art"
                    class="w-full h-screen object-cover" />
            </video>

            <video ref="desktopXLVideo" class="w-full h-screen object-cover"
                :class="{ 'hidden': currentDevice !== 'desktopXL' }" autoplay muted playsinline loop preload="auto"
                @error="handleVideoError('desktopXL')">
                <source src="/videos/hero/Andy-Loisch-Textil-Art-DesktopXL.mp4" type="video/mp4" />
                <NuxtImg src="/videos/hero/Andy-Loisch-Textil-Art-DesktopXL.png" alt="Andy Loisch Textil Art"
                    class="w-full h-screen object-cover" />
            </video>

            <div v-show="showFallback" class="absolute inset-0 w-full h-screen">
                <NuxtImg src="/videos/hero/Andy-Loisch-Textil-Art-Desktop.png" alt="Andy Loisch Textil Art"
                    class="w-full h-screen object-cover" />
            </div>
        </div>
    </DefaultSection>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'

const mobileVideo = ref(null)
const tabletVideo = ref(null)
const desktopVideo = ref(null)
const desktopXLVideo = ref(null)

const currentDevice = ref('desktop')
const showFallback = ref(false)
const failedVideos = ref(new Set())

const breakpoints = {
    mobile: 0,
    tablet: 700,
    desktop: 1080,
    desktopXL: 1440
}

const detectDevice = () => {
    const width = window.innerWidth
    const userAgent = navigator.userAgent

    const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(userAgent)

    if (isMobileUA && !isTabletUA && width < breakpoints.tablet) {
        return 'mobile'
    }

    if ((isTabletUA || (width >= breakpoints.tablet && width < breakpoints.desktop))) {
        return 'tablet'
    }

    if (width >= breakpoints.desktopXL) {
        return 'desktopXL'
    }

    if (width >= breakpoints.desktop) {
        return 'desktop'
    }

    return 'mobile'
}

const currentVideo = computed(() => {
    const videoRefs = {
        mobile: mobileVideo.value,
        tablet: tabletVideo.value,
        desktop: desktopVideo.value,
        desktopXL: desktopXLVideo.value
    }
    return videoRefs[currentDevice.value]
})

const updateDeviceState = () => {
    const previousDevice = currentDevice.value
    currentDevice.value = detectDevice()

    if (previousDevice !== currentDevice.value) {
        console.log(`Dispositivo cambió de ${previousDevice} a ${currentDevice.value}`)
        initializeVideos()
    }
}

const handleVideoError = (deviceType) => {
    console.warn(`Error cargando video para ${deviceType}`)
    failedVideos.value.add(deviceType)

    const videoRefs = {
        mobile: mobileVideo.value,
        tablet: tabletVideo.value,
        desktop: desktopVideo.value,
        desktopXL: desktopXLVideo.value
    }

    if (videoRefs[deviceType]) {
        videoRefs[deviceType].style.display = 'none'
    }

    if (deviceType === currentDevice.value) {
        showFallback.value = true
    }
}

const optimizeMobilePlayback = (videoElement, deviceType) => {
    if (!videoElement || (deviceType !== 'mobile' && deviceType !== 'tablet')) return

    let cleanupFunctions = []

    const handleCanPlay = () => {
        videoElement.play().catch(err => {
            console.log(`Reproducción automática bloqueada en ${deviceType}:`, err)
            handleVideoError(deviceType)
        })
    }

    videoElement.addEventListener('canplay', handleCanPlay)
    cleanupFunctions.push(() => videoElement.removeEventListener('canplay', handleCanPlay))

    const handleVisibilityChange = () => {
        if (document.hidden) {
            videoElement.pause()
        } else if (currentDevice.value === deviceType) {
            videoElement.play().catch(err =>
                console.log(`Error al reanudar video ${deviceType}:`, err)
            )
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    cleanupFunctions.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange))

    return () => {
        cleanupFunctions.forEach(cleanup => cleanup())
    }
}

const initializeVideos = () => {
    showFallback.value = false

    const allVideos = [mobileVideo.value, tabletVideo.value, desktopVideo.value, desktopXLVideo.value]
    allVideos.forEach(video => {
        if (video && !failedVideos.value.has(currentDevice.value)) {
            video.style.display = ''
        }
    })

    const videoToPlay = currentVideo.value
    if (!videoToPlay) return

    if (currentDevice.value === 'mobile' || currentDevice.value === 'tablet') {
        optimizeMobilePlayback(videoToPlay, currentDevice.value)
    }

    videoToPlay.play().catch(err => {
        console.log(`Error de reproducción inicial en ${currentDevice.value}:`, err)
        handleVideoError(currentDevice.value)
    })
}

let resizeTimeout
const handleResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(updateDeviceState, 150)
}

onMounted(() => {
    updateDeviceState()

    window.addEventListener('resize', handleResize)

    nextTick(() => {
        initializeVideos()
    })
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimeout) {
        clearTimeout(resizeTimeout)
    }
})

defineExpose({
    playVideo: () => {
        return currentVideo.value?.play()
    },

    pauseVideo: () => {
        currentVideo.value?.pause()
    },

    getCurrentDevice: () => currentDevice.value,

    isPlaying: computed(() => {
        return currentVideo.value && !currentVideo.value.paused
    }),

    getBreakpoints: () => breakpoints
})
</script>

<style scoped>
video {
    transition: opacity 0.3s ease-in-out;
}

.hidden {
    display: none !important;
}

@media (max-width: 767px) {

    video {
        image-rendering: optimizeSpeed;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {

    video {
        image-rendering: optimizeQuality;
    }
}

@media (min-width: 1024px) {

    video {
        image-rendering: auto;
    }
}

@media (min-width: 1440px) {

    video {
        image-rendering: crisp-edges;
    }
}
</style>