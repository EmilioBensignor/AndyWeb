<template>
    <DefaultSection>
        <div class="w-full overflow-hidden relative">
            <div class="w-max flex items-center bg-secondary border border-light animate-scrollLoop py-3">
                <template v-for="i in 2" :key="i">
                    <div v-for="j in 10" :key="`slide-${i}-${j}`"
                        class="flex items-center justify-center text-light text-sm mr-4">
                        SOY ANDY LOISCH
                    </div>
                </template>
            </div>
        </div>
        <DefaultContent>
            <NuxtImg src="/images/home/Andy-Loisch.png" alt="Andy Loisch" />
        </DefaultContent>
    </DefaultSection>
</template>

<style scoped>
@keyframes scrollLoop {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

.animate-scrollLoop {
    animation: scrollLoop 20s linear infinite;
}
</style>