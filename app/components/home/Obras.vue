<template>
    <DefaultSection
        class="bg-gradient-to-b from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10% pt-32 md:pt-44 xl:pt-60 px-5 md:px-10 xl:px-20 2xl:px-32 pb-16 md:pb-32 xl:pb-40 -mt-32 md:-mt-44 xl:-mt-60 2xl:-mt-64">
        <DefaultContent class="flex flex-col gap-11 md:gap-12">
            <div
                class="w-full grid grid-cols-3 grid-rows-4 xl:grid-cols-4 xl:grid-rows-3 gap-[6px] md:gap-3 xl:gap-4 2xl:gap-6">
                <NuxtLink :to="`${ROUTE_NAMES.OBRAS}/${obra.slug}`" v-for="(obra, index) in obras" :key="index"
                    :class="[baseGrid[index], responsiveGrid[index]]"
                    class="max-h-[112px] md:max-h-[232px] 2xl:max-h-[300px] border border-light relative group overflow-hidden">
                    <img :src="`/images/obras/${obra.imagen}-Andy-Loisch.webp`" :alt="`${obra.titulo} Andy Loisch`"
                        class="w-full h-full object-cover" />
                    <div
                        class="w-full hidden xl:flex flex-col gap-2 absolute bottom-0 left-0 bg-darkOpacity transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 py-2 2xl:py-3 px-4 2xl:px-5">
                        <p class="text-light 2xl:text-xl">{{ obra.titulo }}</p>
                        <p class="text-light text-xs 2xl:text-base">{{ obra.ancho }} x {{ obra.alto }} cm</p>
                    </div>
                </NuxtLink>
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

const obras = [
    {
        slug: "el-beso",
        imagen: "Bordado",
        titulo: "EL BESO",
        ancho: "58",
        alto: "42",
    },
    {
        slug: "estallido",
        imagen: "Textil",
        titulo: "ESTALLIDO",
        ancho: "50",
        alto: "50",
    },
    {
        slug: "arbol-genealogico",
        imagen: "Intervenciones",
        titulo: "ÁRBOL GENEALÓGICO",
        ancho: "46",
        alto: "48",
    },
    {
        slug: "maternidad",
        imagen: "Collage",
        titulo: "MATERNIDAD",
        ancho: "43",
        alto: "59",
    },
    {
        slug: "senderos",
        imagen: "Bordados",
        titulo: "SENDEROS",
        ancho: "111",
        alto: "83",
    },
    {
        slug: "asombro",
        imagen: "Tejido",
        titulo: "ASOMBRO",
        ancho: "27",
        alto: "27",
    },
    {
        slug: "profundidades-del-alma",
        imagen: "Obras",
        titulo: "PROFUNDIDADES DEL ALMA",
        ancho: "133",
        alto: "103",
    },
    {
        slug: "quilombo",
        imagen: "Composicion",
        titulo: "QUILOMBO",
        ancho: "123",
        alto: "110",
    },
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