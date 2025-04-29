<template>
    <DefaultSection
        class="pt-32 md:pt-44 xl:pt-60 px-5 md:px-10 xl:px-20 2xl:px-32 pb-16 md:pb-32 xl:pb-40 -mt-32 md:-mt-44 xl:-mt-60 2xl:-mt-64 bg-gradient-to-b from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10%">
        <DefaultContent class="flex flex-col gap-11 md:gap-12">
            <div class="w-full grid grid-cols-3 grid-rows-4 xl:grid-cols-4 xl:grid-rows-3 gap-[6px] md:gap-3 xl:gap-4 2xl:gap-6">
                <div v-for="(img, index) in images" :key="index" :class="[baseGrid[index], responsiveGrid[index]]"
                    class="max-h-[112px] md:max-h-[232px] 2xl:max-h-[300px] border border-light">
                    <img :src="`/images/obras/${img}-Andy-Loisch.png`" :alt="`${img} Andy Loisch`"
                        class="w-full h-full object-cover" />
                </div>
            </div>
            <div class="flex justify-center">
                <NuxtLink :to="ROUTE_NAMES.OBRAS"
                    class="bg-secondary xl:hover:bg-primary rounded-full border border-light md:text-xl xl:text-3xl 2xl:text-[2rem] text-center text-light transition-all duration-300 py-5 md:py-6 2xl:py-8 px-7 md:px-12">
                    VER TODAS LAS OBRAS
                </NuxtLink>
            </div>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const images = [
    'Bordado',
    'Textil',
    'Intervenciones',
    'Collage',
    'Bordados',
    'Tejido',
    'Obras',
    'Composicion',
]

const baseGrid = [
    'col-span-3 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
]

const responsiveGrid = [
    'xl:col-span-2 xl:row-span-1',
    'xl:col-span-1 xl:row-span-1',
    'xl:col-span-1 xl:row-span-1',
    'xl:col-span-1 xl:row-span-1',
    'xl:col-span-2 xl:row-span-1',
    'xl:col-span-1 xl:row-span-1',
    'xl:col-span-2 xl:row-span-1',
    'xl:col-span-2 xl:row-span-1',
]
</script>