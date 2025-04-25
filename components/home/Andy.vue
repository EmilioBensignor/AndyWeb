<template>
    <DefaultSection class="bg-dark">
        <div class="w-full overflow-hidden relative">
            <div
                class="w-max flex items-center bg-secondary border border-light py-3 whitespace-nowrap animate-marquee">
                <template v-for="i in 2" :key="i">
                    <div v-for="j in 10" :key="`slide-${i}-${j}`"
                        class="flex items-center justify-center text-light text-sm mr-4">
                        SOY ANDY LOISCH
                    </div>
                </template>
            </div>
        </div>
        <DefaultContent>
            <NuxtImg src="/images/home/Andy-Loisch.png" alt="Andy Loisch" class="w-full" />
            <div>
                <div v-for="(frase, index) in frases" :key="index"
                    class="border-b first-of-type:border-t border-light py-8 px-5 transition-all duration-300 overflow-hidden relative"
                    @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null">
                    <div class="absolute inset-0 w-full h-full overflow-hidden">
                        <NuxtImg :src="frase.textura" alt="Textura" class="w-full h-full object-cover texture-image"
                            :class="{ 'active': hoveredIndex === index }" />
                    </div>
                    <p class="relative z-10">{{ frase.texto }}</p>
                </div>
            </div>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
const hoveredIndex = ref(null);

const frases = [
    {
        texto: 'BORDO, CORTO, PEGO, OBSERVO',
        textura: '/images/backgrounds/Textura-1.jpg'
    },
    {
        texto: 'ENCUENTRO BELLEZA EN LO IMPERFECTO',
        textura: '/images/backgrounds/Textura-1.jpg'
    },
    {
        texto: 'BORDO, CORTO, PEGO, OBSERVO',
        textura: '/images/backgrounds/Textura-1.jpg'
    },
    {
        texto: 'ME INSPIRAN LOS OBJETOS OLVIDADOS',
        textura: '/images/backgrounds/Textura-1.jpg'
    },
]
</script>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

.animate-marquee {
    animation: marquee 20s linear infinite;
}

.texture-image {
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.texture-image.active {
    opacity: 1;
    transform: translateY(0);
}
</style>