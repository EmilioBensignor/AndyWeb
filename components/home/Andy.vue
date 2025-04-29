<template>
    <DefaultSection class="bg-dark pb-12 2xl:pb-20">
        <div class="w-full overflow-hidden relative">
            <div
                class="w-max flex items-center bg-secondary border border-light py-3 md:py-[0.875rem] xl:py-4 whitespace-nowrap animate-marquee">
                <template v-for="i in 2" :key="i">
                    <div v-for="j in 10" :key="`slide-${i}-${j}`"
                        class="flex items-center justify-center text-light text-sm md:text-base xl:text-2xl 2xl:text-[2rem] mr-4 md:mr-5 2xl:mr-8">
                        SOY ANDY LOISCH
                    </div>
                </template>
            </div>
        </div>
        <div class="3xl:max-w-[1920px] xl:flex xl:flex-row-reverse xl:justify-between relative overflow-visible">
            <picture class="xl:w-[475px] 2xl:w-[620px] 2xl:h-[660px] xl:absolute xl:top-[1.5rem] 2xl:top-[2rem] xl:-right-[3rem] 1/5xl:right-0 2xl:right-[2rem] xl:z-[2] xl:rotate-[4deg]">
                <source media="(min-width: 1080px)" srcset="/images/home/Andy-Loisch-Desktop.jpg" />
                <NuxtImg src="/images/home/Andy-Loisch.png" alt="Andy Loisch Textil Art"
                    class="w-full xl:w-[475px] 2xl:w-[620px] 2xl:h-[660px] object-cover" />
            </picture>
            <NuxtImg src="/images/home/Pin.png" alt="Pin"
                class="hidden xl:inline xl:w-24 xl:absolute 2xl:top-[0.5rem] right-[7rem] 2xl:right-[14rem] z-[3] -rotate-[100deg]" />
            <div class="w-full">
                <div v-for="(frase, index) in frases" :key="index"
                    class="border-b first-of-type:border-t border-light py-8 xl:py-16 px-5 md:px-10 xl:px-20 transition-all duration-300 overflow-hidden relative"
                    @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null">
                    <div class="absolute inset-0 w-full h-full overflow-hidden">
                        <NuxtImg :src="frase.textura" alt="Textura" class="w-full h-full object-cover texture-image"
                            :class="{ 'active': hoveredIndex === index }" />
                    </div>
                    <DefaultContent>
                        <p class="relative z-10 font-semibold md:text-2xl xl:text-3xl 2xl:text-[2rem]">{{ frase.texto }}</p>
                    </DefaultContent>
                </div>
            </div>
        </div>
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