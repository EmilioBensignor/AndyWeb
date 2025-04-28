<template>
    <DefaultSection
        class="obras-section h-[200vh] bg-gradient-to-t from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10% px-5 -mb-[11rem]">
        <DefaultContent class="h-full relative pt-[12.5rem]">
            <h2 class="sticky top-[50%] text-center text-4xl font-semibold text-light -translate-y-1/2 pb-[12.5rem]">MIS
                OBRAS</h2>
            <div class="w-full max-w-6xl mx-auto absolute inset-0 h-full">
                <div ref="card1" class="w-full max-w-[180px] absolute left-0 top-1/3 translate-y-[200px]">
                    <div class="bg-light rounded-[20px] preserve-3d perspective-800">
                        <NuxtImg :src="`/images/home/${cards[0].img}-Andy-Loisch.jpg`"
                            :alt="`${cards[0].title} Andy Loisch`" class="rounded-t-[20px] w-full" />
                        <div class="py-6 text-center">
                            <h3 class="font-medium text-secondary">{{ cards[0].title }}</h3>
                        </div>
                    </div>
                </div>

                <div ref="card2" class="w-full max-w-[180px] absolute right-0 top-1/2 translate-y-[200px]">
                    <div class="bg-light rounded-[20px] preserve-3d perspective-800">
                        <NuxtImg :src="`/images/home/${cards[1].img}-Andy-Loisch.jpg`"
                            :alt="`${cards[1].title} Andy Loisch`" class="rounded-t-[20px] w-full" />
                        <div class="py-6 text-center">
                            <h3 class="font-medium text-secondary">{{ cards[1].title }}</h3>
                        </div>
                    </div>
                </div>

                <div ref="card3" class="w-full max-w-[180px] absolute left-0 top-3/4 translate-y-[200px]">
                    <div class="bg-light rounded-[20px] preserve-3d perspective-800">
                        <NuxtImg :src="`/images/home/${cards[2].img}-Andy-Loisch.jpg`"
                            :alt="`${cards[2].title} Andy Loisch`" class="rounded-t-[20px] w-full" />
                        <div class="py-6 text-center">
                            <h3 class="font-medium text-secondary">{{ cards[2].title }}</h3>
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
        img: "Pequeno-Formato",
    },
    {
        title: "OBJETOS",
        img: "Pequeno-Formato",
    },
]

const card1 = ref(null)
const card2 = ref(null)
const card3 = ref(null)

onMounted(() => {
    if (process.client) {
        $ScrollTrigger.create({
            trigger: card1.value,
            start: "top bottom",
            end: "top center",
            scrub: true,
            onUpdate: self => {
                const rotationY = -180 * (1 - self.progress);
                $gsap.to(card1.value, {
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
                const progressCard1 = Math.max(0, (self.progress - 0.1) * 1.5);
                const normalizedProgress1 = Math.min(1, progressCard1);

                $gsap.to(card1.value, {
                    y: 400 - (normalizedProgress1 * 400),
                    duration: 0.1
                });
            }
        });

        $ScrollTrigger.create({
            trigger: card2.value,
            start: "top bottom",
            end: "top center",
            scrub: true,
            onUpdate: self => {
                const rotationY = 180 * (1 - self.progress);
                $gsap.to(card2.value, {
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
                const progressCard2 = Math.max(0, (self.progress - 0.2) * 1.5);
                const normalizedProgress2 = Math.min(1, progressCard2);

                $gsap.to(card2.value, {
                    y: 400 - (normalizedProgress2 * 400),
                    duration: 0.1
                });
            }
        });

        $ScrollTrigger.create({
            trigger: card3.value,
            start: "top bottom",
            end: "top center",
            scrub: true,
            onUpdate: self => {
                const rotationY = -180 * (1 - self.progress);
                $gsap.to(card3.value, {
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
                const progressCard3 = Math.max(0, (self.progress - 0.3) * 1.5);
                const normalizedProgress3 = Math.min(1, progressCard3);

                $gsap.to(card3.value, {
                    y: 400 - (normalizedProgress3 * 400),
                    duration: 0.1
                });
            }
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