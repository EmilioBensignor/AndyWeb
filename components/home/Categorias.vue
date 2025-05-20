<template>
    <DefaultSection
        class="obras-section h-[200vh] md:h-[250vh] xl:h-[280vh] bg-gradient-to-t from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10% md:to-5% px-5 md:px-10 xl:px-20 2xl:px-32 -mb-56 md:-mb-80">
        <DefaultContent class="h-full relative pt-52 md:pt-60 xl:pt-72">
            <h2
                class="sticky top-[50%] md:top-[60%] text-center text-4xl md:text-6xl font-semibold text-light -translate-y-1/2 pb-52 md:pb-60 xl:pb-72">
                MIS OBRAS
            </h2>
            <div class="w-full absolute inset-0 h-full">
                <div v-for="(card, index) in cards" :key="index" :ref="el => cardRefs[index] = el" 
                    :class="['w-full max-w-[180px] md:max-w-[250px] 2xl:max-w-[360px] md:h-[340px] 2xl:h-[420px] absolute translate-y-[200px]',
                    index === 0 ? 'left-0 top-[30vh]' : index === 1 ? 'right-0 top-[80vh] md:top-[90vh] xl:top-[100vh]' : 'left-0 top-[130vh] md:top-[150vh] xl:top-[170vh] xl:left-0 xl:right-0 xl:mx-auto']">
                    <div class="h-full bg-light rounded-[20px] preserve-3d perspective-800">
                        <NuxtImg :src="`/images/categorias/${card.img}-Andy-Loisch.webp`" :alt="`${card.title} Andy Loisch`"
                            class="w-full h-full md:max-h-[260px] 2xl:max-h-[340px] rounded-t-[20px] object-cover" />
                        <div class="py-6 text-center">
                            <h3 class="md:text-2xl 2xl:text-3xl font-medium text-secondary">{{ card.title }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
const { $gsap, $ScrollTrigger } = useNuxtApp()

const cards = [
    {
        title: "PEQUEÑO FORMATO",
        img: "Pequeno-Formato",
    },
    {
        title: "GRAN FORMATO",
        img: "Gran-Formato",
    },
    {
        title: "OBJETOS",
        img: "Objetos",
    },
]

const cardRefs = ref([])

onMounted(() => {
    if (process.client) {
        cardRefs.value.forEach((card, index) => {
            $ScrollTrigger.create({
                trigger: card,
                start: "top bottom",
                end: "top center",
                scrub: true,
                onUpdate: self => {
                    const rotationY = (index % 2 === 0 ? -180 : 180) * (1 - self.progress);
                    $gsap.to(card, {
                        rotationY: rotationY,
                        duration: 0.1
                    });
                }
            });

            $ScrollTrigger.create({
                trigger: ".obras-section",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: self => {
                    const delay = 0.1 * (index + 1);
                    const progressCard = Math.max(0, (self.progress - delay) * 1.5);
                    const normalizedProgress = Math.min(1, progressCard);

                    $gsap.to(card, {
                        y: 200 - (normalizedProgress * 200),
                        duration: 0.1
                    });
                }
            });
        });
    }
})

onBeforeUnmount(() => {
    if (process.client && $ScrollTrigger) {
        $ScrollTrigger.getAll().forEach(st => st.kill());
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