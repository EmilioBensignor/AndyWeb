<template>
    <footer
        class="relative z-[2] bg-[url('/images/backgrounds/Flores-Andy-Loisch.jpg')] bg-cover bg-center bg-no-repeat text-light p-5 pt-36 md:pt-72 xl:pt-80 md:px-10 xl:px-20 md:pb-8 xl:pb-10">
        <DefaultContent class="flex flex-col gap-8 md:gap-10">
            <div class="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-5 md:gap-6">
                <h1 class="text-xl md:text-4xl xl:text-5xl">ANDY LOISCH</h1>
                <p class="text-sm md:text-lg xl:text-2xl">BUENOS AIRES, ARGENTINA</p>
            </div>
            <nav>
                <ul class="flex md:justify-center items-center flex-wrap gap-8 md:gap-10">
                    <li v-for="(link, index) in links" :key="index">
                        <NuxtLink :to="link.url" class="text-sm md:text-lg xl:text-2xl underline">{{ link.name }}</NuxtLink>
                    </li>
                </ul>
            </nav>
            <p class="text-sm md:text-lg xl:text-2xl md:text-center">2025 ANDY LOISCH © TODOS LOS DERECHOS RESERVADOS </p>
        </DefaultContent>
    </footer>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';

const links = [
    {
        name: "INICIO",
        url: ROUTE_NAMES.HOME,
    },
    {
        name: "OBRAS",
        url: ROUTE_NAMES.HOME,
    },
    {
        name: "INSPIRACIÓN",
        url: ROUTE_NAMES.HOME,
    },
    {
        name: "INSTAGRAM",
        url: "/",
    },
    {
        name: "CONTACTO",
        url: "/",
    },
]
</script>