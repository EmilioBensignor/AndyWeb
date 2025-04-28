<template>
    <footer
        class="relative z-[2] bg-[url('/images/backgrounds/Flores-Andy-Loisch.jpg')] bg-cover bg-center bg-no-repeat text-light p-5 pt-[9rem]">
        <DefaultContent class="flex flex-col gap-8">
            <h1 class="text-xl">ANDY LOISCH</h1>
            <p class="text-sm">BUENOS AIRES, ARGENTINA</p>
            <nav>
                <ul class="flex items-center flex-wrap gap-8">
                    <li v-for="(link, index) in links" :key="index">
                        <NuxtLink :to="link.url" class="underline">{{ link.name }}</NuxtLink>
                    </li>
                </ul>
            </nav>
            <p>2025 ANDY LOISCH © TODOS LOS DERECHOS RESERVADOS </p>
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