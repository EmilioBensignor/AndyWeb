<template>
    <NuxtLink :to="to"
        class="w-[48.5%] md:w-[31.25%] xl:w-[23.25%] min-h-[172px] md:max-h-[230px] 2xl:max-h-[300px] border border-light relative group overflow-hidden">
        <img :src="obra.imagen_url" :alt="`${obra.titulo} - Andy Loisch`"
            class="w-full h-full object-cover transition-transform duration-300 xl:group-hover:scale-105" />
        <div class="w-full flex flex-col gap-1 xl:gap-2 absolute bottom-0 left-0 bg-darkOpacity py-1 xl:py-2 2xl:py-3 px-[5px] md:px-2 xl:px-4 2xl:px-5">
            <p class="text-light text-xs md:text-sm xl:text-base 2xl:text-xl">{{ obra.titulo}}</p>
            <p class="text-light text-[0.625rem] md:text-xs xl:text-sm 2xl:text-base">{{ obra.ancho}} x {{ obra.alto}} cm</p>
        </div>
    </NuxtLink>
</template>

<script setup>
defineProps({
    obra: {
        type: Object,
        required: true
    },
    to: {
        type: String,
        required: true
    }
});
</script>