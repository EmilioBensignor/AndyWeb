<template>
    <DefaultSection
        class="px-5 pt-[7.5rem] pb-[3.75rem] -mt-[8rem] bg-gradient-to-b from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10%">
        <DefaultContent class="flex flex-col gap-11">
            <div class="grid grid-cols-3 grid-rows-4 xl:grid-cols-4 xl:grid-rows-3 gap-[6px] w-full max-w-6xl mx-auto">
                <div v-for="(img, index) in images" :key="index" :class="[baseGrid[index], responsiveGrid[index]]"
                    class="max-h-[112px] border border-light">
                    <img :src="`/images/obras/${img}-Andy-Loisch.png`" :alt="`${img} Andy Loisch`"
                        class="w-full h-full object-cover" />
                </div>
            </div>
            <div class="flex justify-center">
                <NuxtLink :to="ROUTE_NAMES.OBRAS"
                    class="bg-secondary rounded-full border border-light text-center text-light py-5 px-7">
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
    'Bordados',
    'Collage',
    'Composicion',
    'Intervenciones',
    'Obras',
    'Tejido',
    'Textil',
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