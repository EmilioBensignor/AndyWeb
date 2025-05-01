<template>
    <DefaultSection
        class="relative z-[3] bg-gradient-to-t from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10% pt-20 md:pt-32 xl:pt-40 2xl:pt-44 px-5 md:px-10 xl:px-20 2xl:px-32 pb-36 md:pb-60 xl:pb-64 -mb-32 md:-mb-72">
        <DefaultContent class="flex flex-col gap-6 md:gap-8 xl:gap-14">
            <ClientOnly>
                <NuxtLink :to="ROUTE_NAMES.OBRAS" class="flex items-center gap-3 text-xs md:text-base 2xl:text-xl">
                    <Icon name="tabler:arrow-narrow-left" size="1.5rem" />
                    VOLVER A OBRAS
                </NuxtLink>

                <div v-if="isLoading" class="flex justify-center items-center py-32">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>

                <div v-else-if="error" class="py-32 text-center">
                    <DefaultH1>Error al cargar la obra</DefaultH1>
                    <p class="text-light">{{ error }}</p>
                </div>

                <div v-else-if="!obra" class="py-32 text-center">
                    <DefaultH1>Obra no encontrada</DefaultH1>
                </div>

                <div v-else class="flex flex-col xl:flex-row-reverse gap-6 md:gap-8 xl:gap-11">
                    <div class="xl:w-[40%] flex flex-col gap-4 md:gap-7">
                        <div
                            class="w-max bg-secondary border border-light rounded-full py-[0.625rem] md:py-[0.875rem] px-6 md:px-8">
                            <p class="text-sm md:text-base xl:text-lg 2xl:text-2xl font-medium">{{ obra.categoria.toUpperCase() }}
                            </p>
                        </div>
                        <DefaultH1 class="text-start">{{ obra.titulo.toUpperCase() }}</DefaultH1>
                        <p class="hidden xl:inline text-xl 2xl:text-2xl">{{ obra.descripcion }}</p>
                        <p class="hidden xl:inline text-xl 2xl:text-2xl">{{ obra.ancho }} x {{ obra.alto }} cm</p>
                        <p class="hidden xl:inline text-xl 2xl:text-2xl">{{ obra.anio }}</p>
                    </div>

                    <div class="xl:w-[60%]">
                        <div v-if="sortedImagenes.length > 1" class="flex flex-col gap-6 md:gap-8">
                            <div class="relative overflow-hidden px-7 md:px-8">
                                <NuxtImg :src="imagenSeleccionada" :alt="obra.titulo"
                                    class="w-max h-[14.5rem] md:h-[27.375rem] border border-light object-cover transition-all duration-500" />

                                <button @click="prevImagen"
                                    class="flex justify-center items-center absolute top-1/2 -left-1 -translate-y-1/2">
                                    <Icon name="tabler:chevron-left" size="2rem" />
                                </button>

                                <button @click="nextImagen"
                                    class="flex justify-center items-center absolute top-1/2 -right-1 -translate-y-1/2">
                                    <Icon name="tabler:chevron-right" size="2rem" />
                                </button>
                            </div>

                            <div class="xl:hidden flex gap-4 md:gap-6 overflow-x-auto custom-scroll pb-3 md:pb-4">
                                <button v-for="(img, i) in sortedImagenes" :key="i"
                                    @click="imagenSeleccionada = img.url"
                                    class="w-[5.25rem] md:w-44 h-[5.25rem] md:h-[8.25rem] border overflow-hidden shrink-0">
                                    <NuxtImg :src="img.url" class="w-full h-full object-cover" />
                                </button>
                            </div>
                        </div>

                        <div v-else class="border border-light">
                            <NuxtImg :src="obra.imagen_url" :alt="obra.titulo"
                                class="w-full h-[14.5rem] md:h-[27.375rem] object-cover" />
                        </div>
                    </div>

                    <div class="xl:hidden flex flex-col md:flex-row gap-5 md:gap-8">
                        <div class="md:w-1/2">
                            <p class="text-sm md:text-base">{{ obra.descripcion }}</p>
                        </div>
                        <div class="md:w-1/2 flex flex-col gap-5">
                            <p class="text-sm md:text-base">{{ obra.ancho }} x {{ obra.alto }} cm</p>
                            <p class="text-sm md:text-base">{{ obra.anio }}</p>
                        </div>
                    </div>

                </div>
                <div v-if="sortedImagenes.length > 1" class="hidden xl:flex gap-4 md:gap-6 overflow-x-auto custom-scroll pb-3 md:pb-4">
                    <button v-for="(img, i) in sortedImagenes" :key="i" @click="imagenSeleccionada = img.url"
                        class="w-44 h-[14.5rem] 2xl:h-44 border overflow-hidden shrink-0">
                        <NuxtImg :src="img.url" class="w-full h-full object-cover" />
                    </button>
                </div>
            </ClientOnly>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';
import { useObrasStore } from '~/store/obras';

const route = useRoute();
const obrasStore = useObrasStore();
const slug = route.params.slug;

const obra = ref(null);
const isLoading = ref(true);
const error = ref(null);
const imagenSeleccionada = ref(null);
const sortedImagenes = ref([]);

onMounted(async () => {
    try {
        const obras = obrasStore.getObras;
        if (obras.length > 0) {
            obra.value = obras.find(o => o.slug === slug);
        } else {
            const res = await obrasStore.fetchObraBySlug(slug);
            obra.value = res.obra;
            if (res.error) throw res.error;
        }

        if (obra.value) {
            const imagenesConMeta = obra.value.obras_imagenes || [];

            const principal = imagenesConMeta.find(i => i.es_principal);
            const otras = imagenesConMeta
                .filter(i => !i.es_principal)
                .sort((a, b) => a.posicion - b.posicion);

            sortedImagenes.value = principal ? [principal, ...otras] : [...otras];

            imagenSeleccionada.value = sortedImagenes.value[0]?.url;
        }

    } catch (err) {
        error.value = err.message || 'Error al cargar la obra';
    } finally {
        isLoading.value = false;
    }
});

function prevImagen() {
    const index = sortedImagenes.value.findIndex(i => i.url === imagenSeleccionada.value);
    const newIndex = (index - 1 + sortedImagenes.value.length) % sortedImagenes.value.length;
    imagenSeleccionada.value = sortedImagenes.value[newIndex].url;
}

function nextImagen() {
    const index = sortedImagenes.value.findIndex(i => i.url === imagenSeleccionada.value);
    const newIndex = (index + 1) % sortedImagenes.value.length;
    imagenSeleccionada.value = sortedImagenes.value[newIndex].url;
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    height: 0.375rem;
}

.custom-scroll::-webkit-scrollbar-track {
    background: #191919;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background-color: #A91F25;
    border-radius: 10px;
}
</style>