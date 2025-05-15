<template>
    <NuxtLink :to="ROUTE_NAMES.HOME">
        <NuxtImg src="/images/Andy-Loisch-Logo.svg" alt="Andy Loisch Logo"
            class="h-8 md:h-12 xl:h-16 2xl:h-20 object-contain" />
    </NuxtLink>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';
</script>