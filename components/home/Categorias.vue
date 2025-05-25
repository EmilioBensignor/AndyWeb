<template>
    <DefaultSection
        class="obras-section h-[200vh] md:h-[250vh] xl:h-[280vh] bg-gradient-to-t from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10% md:to-5% px-5 md:px-10 xl:px-20 2xl:px-32 -mb-56 md:-mb-80">
        <DefaultContent class="h-full relative pt-52 md:pt-60 xl:pt-72">
            <h2
                class="sticky top-[50%] md:top-[60%] text-center text-4xl md:text-6xl font-semibold text-light -translate-y-1/2 pb-52 md:pb-60 xl:pb-72">
                MIS OBRAS
            </h2>
            <div class="w-full absolute inset-0 h-full">
                <!-- Envolver las animaciones en ClientOnly -->
                <ClientOnly>
                    <NuxtLink v-for="(card, index) in cards" :key="index" :to="getCardLink(card)"
                        :ref="el => setCardRef(el, index)"
                        :class="['w-full max-w-[180px] md:max-w-[250px] 2xl:max-w-[360px] md:h-[340px] 2xl:h-[420px] absolute translate-y-[200px]',
                            index === 0 ? 'left-0 top-[30vh]' : index === 1 ? 'right-0 top-[80vh] md:top-[90vh] xl:top-[100vh]' : 'left-0 top-[130vh] md:top-[150vh] xl:top-[170vh] xl:left-0 xl:right-0 xl:mx-auto']">
                        <div class="h-full bg-light rounded-[20px] preserve-3d perspective-800">
                            <NuxtImg :src="`/images/categorias/${card.img}-Andy-Loisch.webp`"
                                :alt="`${card.title} Andy Loisch`"
                                class="w-full h-full md:max-h-[260px] 2xl:max-h-[340px] rounded-t-[20px] object-cover" />
                            <div class="py-6 text-center">
                                <h3 class="md:text-2xl 2xl:text-3xl font-medium text-secondary">{{ card.title }}</h3>
                            </div>
                        </div>
                    </NuxtLink>

                    <!-- Placeholder para SSR -->
                    <template #fallback>
                        <NuxtLink v-for="(card, index) in cards" :key="`fallback-${index}`" :to="getCardLink(card)"
                            :class="['w-full max-w-[180px] md:max-w-[250px] 2xl:max-w-[360px] md:h-[340px] 2xl:h-[420px] absolute translate-y-[200px]',
                                index === 0 ? 'left-0 top-[30vh]' : index === 1 ? 'right-0 top-[80vh] md:top-[90vh] xl:top-[100vh]' : 'left-0 top-[130vh] md:top-[150vh] xl:top-[170vh] xl:left-0 xl:right-0 xl:mx-auto']">
                            <div class="h-full bg-light rounded-[20px]">
                                <NuxtImg :src="`/images/categorias/${card.img}-Andy-Loisch.webp`"
                                    :alt="`${card.title} Andy Loisch`"
                                    class="w-full h-full md:max-h-[260px] 2xl:max-h-[340px] rounded-t-[20px] object-cover" />
                                <div class="py-6 text-center">
                                    <h3 class="md:text-2xl 2xl:text-3xl font-medium text-secondary">{{ card.title }}
                                    </h3>
                                </div>
                            </div>
                        </NuxtLink>
                    </template>
                </ClientOnly>
            </div>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';

const { $gsap, $ScrollTrigger } = useNuxtApp()

// Mapeo de categorías para query params (usando los UUIDs de tu DB)
const categoryMapping = {
    "PEQUEÑO FORMATO": "pequeno-formato",
    "GRAN FORMATO": "gran-formato",
    "OBJETOS": "objetos"
}

const cards = [
    {
        title: "PEQUEÑO FORMATO",
        img: "Pequeno-Formato",
        link: ROUTE_NAMES.OBRAS,
        categoryId: "a013d08d-c2af-45e5-b667-346322b1dcca" // UUID de Pequeño formato
    },
    {
        title: "GRAN FORMATO",
        img: "Gran-Formato",
        link: ROUTE_NAMES.OBRAS,
        categoryId: "912a0c59-b9f1-44b4-b83a-6b858c128a47" // UUID de Gran formato
    },
    {
        title: "OBJETOS",
        img: "Objetos",
        link: ROUTE_NAMES.OBRAS,
        categoryId: "cb31a70a-0522-4332-8f94-7de758447551" // UUID de Objeto
    },
]

// Función para generar el link con query parameter
const getCardLink = (card) => {
    const categorySlug = categoryMapping[card.title]
    return {
        path: card.link,
        query: { categoria: categorySlug }
    }
}

// Referencias y manejo de ScrollTrigger
const cardRefs = ref([])
const scrollTriggers = ref([])

const setCardRef = (el, index) => {
    if (el) {
        cardRefs.value[index] = el
    }
}

// Solo ejecutar en cliente con un delay adicional
const initScrollTriggers = () => {
    if (!process.client || !$gsap || !$ScrollTrigger) return

    // Doble nextTick para asegurar que todo esté renderizado
    nextTick(() => {
        nextTick(() => {
            // Esperar un poco más para estar seguros
            setTimeout(() => {
                const validCardRefs = cardRefs.value.filter(card =>
                    card &&
                    card.$el && // Para componentes Vue
                    typeof (card.$el || card).getBoundingClientRect === 'function'
                )

                if (validCardRefs.length === 0) {
                    console.warn('[Categorias] No se encontraron referencias válidas de cards')
                    return
                }

                console.log(`[Categorias] Inicializando ScrollTrigger para ${validCardRefs.length} cards`)

                validCardRefs.forEach((cardRef, index) => {
                    // Obtener el elemento real (puede ser un wrapper de Vue)
                    const card = cardRef.$el || cardRef

                    // ScrollTrigger para rotación
                    const rotationTrigger = $ScrollTrigger.create({
                        trigger: card,
                        start: "top bottom",
                        end: "top center",
                        scrub: true,
                        onUpdate: self => {
                            const rotationY = (index % 2 === 0 ? -180 : 180) * (1 - self.progress)
                            $gsap.to(card, {
                                rotationY: rotationY,
                                duration: 0.1
                            })
                        }
                    })

                    // ScrollTrigger para animación vertical
                    const verticalTrigger = $ScrollTrigger.create({
                        trigger: ".obras-section",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true,
                        onUpdate: self => {
                            const delay = 0.1 * (index + 1)
                            const progressCard = Math.max(0, (self.progress - delay) * 1.5)
                            const normalizedProgress = Math.min(1, progressCard)

                            $gsap.to(card, {
                                y: 200 - (normalizedProgress * 200),
                                duration: 0.1
                            })
                        }
                    })

                    scrollTriggers.value.push(rotationTrigger, verticalTrigger)
                })
            }, 100) // Delay adicional de 100ms
        })
    })
}

onMounted(() => {
    if (process.client) {
        initScrollTriggers()
    }
})

onBeforeUnmount(() => {
    if (process.client && scrollTriggers.value.length > 0) {
        scrollTriggers.value.forEach(trigger => {
            if (trigger && typeof trigger.kill === 'function') {
                trigger.kill()
            }
        })
        scrollTriggers.value = []
    }

    if ($ScrollTrigger) {
        $ScrollTrigger.getAll().forEach(st => st.kill())
    }
})
</script>

<style scoped>
.preserve-3d {
    transform-style: preserve-3d;
}

.perspective-800 {
    perspective: 800px;
}
</style>