<template>
    <DefaultSection class="bg-gradient-to-b from-darkOpacity to-dark px-5 pt-[7.5rem] pb-[3.75rem] -mt-[10rem]">
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

// Base layout: grid de 3 columnas × 4 filas
const baseGrid = [
    'col-span-3 row-span-1', // div1
    'col-span-1 row-span-1', // div2
    'col-span-1 row-span-1', // div3
    'col-span-1 row-span-1', // div4
    'col-span-2 row-span-1', // div5
    'col-span-1 row-span-1', // div6
    'col-span-1 row-span-1', // div7
    'col-span-2 row-span-1', // div8
]

// Responsive layout: grid de 4 columnas × 3 filas (a partir de xl)
const responsiveGrid = [
    'xl:col-span-2 xl:row-span-1', // div1
    'xl:col-span-1 xl:row-span-1', // div2
    'xl:col-span-1 xl:row-span-1', // div3
    'xl:col-span-1 xl:row-span-1', // div4
    'xl:col-span-2 xl:row-span-1', // div5
    'xl:col-span-1 xl:row-span-1', // div6
    'xl:col-span-2 xl:row-span-1', // div7
    'xl:col-span-2 xl:row-span-1', // div8
]
</script>