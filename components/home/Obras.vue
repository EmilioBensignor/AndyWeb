<template>
    <DefaultSection>
        <DefaultContent class="flex flex-col items-center pt-[7.5rem] px-5 pb-[3.75rem]">
            <NuxtLink :to="ROUTE_NAMES.OBRAS" class=" bg-secondary rounded-full border border-light text-center text-light py-5 px-7">VER TODAS LAS OBRAS</NuxtLink>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';

</script>