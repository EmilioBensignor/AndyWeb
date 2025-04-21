<template>
    <DefaultSection>
        <DefaultContent class="pt-[60px]">
            <div class="w-full border border-light overflow-hidden bg-secondary"
                style="--width: 100%; --height: 100px; --quantity: 10;">
                <div class="w-full flex relative">
                    <div v-for="n in 10" :key="n" :style="{
                        '--position': n,
                        width: 'var(--width)',
                        height: 'var(--height)',
                        position: 'absolute',
                        left: '100%',
                        animation: 'autoRun 10s linear infinite',
                        animationDelay: `calc((10s / var(--quantity)) * (var(--position) - 1))`
                    }" class="flex items-center justify-center">
                        <p class="text-xl font-bold">SOY ANDY LOISCH</p>
                    </div>
                </div>
            </div>
        </DefaultContent>
    </DefaultSection>
</template>