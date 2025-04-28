<template>
    <DefaultSection
        class="bg-gradient-to-t from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-15% py-[12.5rem] px-5 -mb-[11rem]">
        <DefaultContent>
            <h2 class="text-3xl font-bold text-light mb-12">MIS OBRAS</h2>
            <div ref="container" class="flex flex-wrap justify-center overflow-hidden">
                <div v-for="(item, i) in cards" :key="i" :ref="el => (cardsRefs[i] = el)"
                    class="card w-64 h-40 bg-light rounded-lg shadow-lg m-4 flex items-center justify-center preserve-3d perspective-800">
                    <span class="text-lg font-medium text-dark">{{ item.title }}</span>
                </div>
            </div>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { $gsap, $ScrollTrigger } = useNuxtApp()

const cards = [
    { title: "User's Valentine" },
    { title: "Mobile Maniac" },
    { title: "Developer" },
]

const container = ref(null)
const cardsRefs = ref([])

onMounted(() => {
    if (process.client) {
        cardsRefs.value.forEach(cardEl => {
            const startAngle = -180
            const endAngle = 0
            $ScrollTrigger.create({
                trigger: cardEl,
                start: 'top 100%',
                end: 'bottom 50%',
                scrub: true,
                onUpdate: self => {
                    const angle = startAngle + (endAngle - startAngle) * self.progress
                    $gsap.set(cardEl, { rotationY: angle })
                }
            })
        })
    }
})

onBeforeUnmount(() => {
    if (process.client && $ScrollTrigger) {
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