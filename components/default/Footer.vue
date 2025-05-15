<template>
    <footer
        class="relative z-[2] bg-[url('/images/backgrounds/Textura-Andy-Loisch.png')] bg-cover bg-center bg-no-repeat text-light p-5 pt-40 md:pt-72 xl:pt-80 md:px-10 xl:px-20 2xl:px-32 md:pb-8 xl:pb-10">
        <DefaultContent class="flex flex-col gap-8 md:gap-10 2xl:gap-16">
            <div class="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-5 md:gap-6">
                <DefaultLogo class="w-max" />
                <p class="text-sm md:text-lg xl:text-2xl 2xl:text-[1.75rem]">BUENOS AIRES, ARGENTINA</p>
            </div>
            <nav>
                <ul class="flex md:justify-center items-center flex-wrap gap-8 md:gap-10">
                    <li v-for="(link, index) in links" :key="index">
                        <DefaultLink :to="link.url" :target="link.target ? '_blank' : undefined">{{ link.name }}</DefaultLink>
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
        url: ROUTE_NAMES.OBRAS,
    },
    {
        name: "INSPIRACIÓN",
        url: ROUTE_NAMES.INSPIRACIONES,
    },
    {
        name: "INSTAGRAM",
        url: ROUTE_NAMES.INSTAGRAM,
        target: true,
    },
]
</script>