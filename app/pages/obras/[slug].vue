<template>
    <DefaultSection
        class="relative z-[3] bg-gradient-to-t from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10% pt-20 md:pt-32 xl:pt-40 2xl:pt-44 px-5 md:px-10 xl:px-20 2xl:px-32 pb-36 md:pb-60 xl:pb-64 -mb-32 md:-mb-72">
        <DefaultContent class="flex flex-col gap-6 md:gap-8 xl:gap-14">
            <ClientOnly>
                <NuxtLink :to="ROUTE_NAMES.OBRAS"
                    class="w-max flex items-center gap-3 text-xs md:text-base 2xl:text-xl">
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
                            <p class="text-sm md:text-base xl:text-lg 2xl:text-2xl font-medium">{{
                                obra.categoria.toUpperCase() }}
                            </p>
                        </div>
                        <DefaultH1 class="text-start leading-10">{{ obra.titulo.toUpperCase() }}</DefaultH1>
                        <p class="hidden xl:inline text-xl 2xl:text-2xl">{{ obra.descripcion }}</p>
                        <p class="hidden xl:inline text-xl 2xl:text-2xl">{{ obra.ancho }} x {{ obra.alto }} cm</p>
                        <p class="hidden xl:inline text-xl 2xl:text-2xl">{{ obra.anio }}</p>
                    </div>

                    <div class="xl:w-[60%]">
                        <div v-if="sortedImagenes.length > 1" class="flex flex-col gap-6 md:gap-8">
                            <div class="w-fit xl:w-auto flex justify-center relative overflow-hidden px-8 xl:px-10">
                                <NuxtImg :src="imagenSeleccionada" :alt="obra.titulo"
                                    class="w-max xl:w-full border border-light object-cover cursor-pointer hover:brightness-110 transition-all duration-300"
                                    @click="abrirModal" />

                                <button @click="prevImagen"
                                    class="flex justify-center items-center absolute top-1/2 -left-2 -translate-y-1/2 z-10">
                                    <Icon name="tabler:chevron-left" size="2rem" />
                                </button>

                                <button @click="nextImagen"
                                    class="flex justify-center items-center absolute top-1/2 -right-2 -translate-y-1/2 z-10">
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

                        <div v-else>
                            <NuxtImg :src="obra.imagen_url" :alt="obra.titulo"
                                class="w-max xl:w-full object-cover border border-light cursor-pointer hover:brightness-110 transition-all duration-300"
                                @click="abrirModal" />
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
                <div v-if="sortedImagenes.length > 1"
                    class="hidden xl:flex gap-4 md:gap-6 overflow-x-auto custom-scroll pb-3 md:pb-4">
                    <button v-for="(img, i) in sortedImagenes" :key="i" @click="imagenSeleccionada = img.url"
                        class="w-44 h-[14.5rem] 2xl:h-44 border overflow-hidden shrink-0">
                        <NuxtImg :src="img.url" class="w-full h-full object-cover" />
                    </button>
                </div>

                <Teleport to="body">
                    <div v-if="modalAbierto"
                        class="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center p-4"
                        @click="cerrarModal">

                        <div class="w-full max-w-[1000px] max-h-[90vh] relative flex items-center justify-center">
                            <button @click="cerrarModal"
                                class="absolute top-0 right-0 text-white hover:text-gray-300 transition-colors z-10">
                                <Icon name="tabler:x" size="2rem" />
                            </button>

                            <div v-if="sortedImagenes.length > 1" class="w-full flex items-center gap-4">
                                <button @click.stop="prevImagenModal"
                                    class="text-white hover:text-gray-300 transition-colors p-2">
                                    <Icon name="tabler:chevron-left" size="2.5rem" />
                                </button>
                                <div class="w-full flex justify-center relative">
                                    <NuxtImg :src="imagenModalActual" :alt="obra.titulo"
                                        class="w-full max-h-[90vh] object-contain" @click.stop />

                                    <div
                                        class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm">
                                        {{ indiceModalActual + 1 }} / {{ sortedImagenes.length }}
                                    </div>
                                </div>

                                <button @click.stop="nextImagenModal"
                                    class="text-white hover:text-gray-300 transition-colors p-2">
                                    <Icon name="tabler:chevron-right" size="2.5rem" />
                                </button>
                            </div>

                            <div v-else class="w-full flex justify-center relative">
                                <NuxtImg :src="imagenModalActual" :alt="obra.titulo"
                                    class="w-full max-h-[90vh] object-contain" @click.stop />
                            </div>
                        </div>
                    </div>
                </Teleport>
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

const modalAbierto = ref(false);
const imagenModalActual = ref(null);
const indiceModalActual = ref(0);

onMounted(async () => {
    try {
        const result = await obrasStore.fetchObraBySlug(slug);

        if (result.error) {
            throw new Error(result.error);
        }

        if (!result.obra) {
            throw new Error(`Obra "${slug}" no encontrada`);
        }

        obra.value = result.obra;

        const imagenesConMeta = obra.value.obras_imagenes || [];

        const principal = imagenesConMeta.find(i => i.es_principal);
        const otras = imagenesConMeta
            .filter(i => !i.es_principal)
            .sort((a, b) => a.posicion - b.posicion);

        sortedImagenes.value = principal ? [principal, ...otras] : [...otras];
        imagenSeleccionada.value = sortedImagenes.value[0]?.url || obra.value.imagen_url;

    } catch (err) {
        console.error('Error cargando obra:', err);
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

function abrirModal() {
    if (sortedImagenes.value.length > 0) {
        const index = sortedImagenes.value.findIndex(i => i.url === imagenSeleccionada.value);
        indiceModalActual.value = index >= 0 ? index : 0;
        imagenModalActual.value = sortedImagenes.value[indiceModalActual.value].url;
    } else {
        imagenModalActual.value = obra.value.imagen_url;
        indiceModalActual.value = 0;
    }

    modalAbierto.value = true;
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modalAbierto.value = false;
    document.body.style.overflow = '';
}

function prevImagenModal() {
    if (sortedImagenes.value.length > 1) {
        indiceModalActual.value = (indiceModalActual.value - 1 + sortedImagenes.value.length) % sortedImagenes.value.length;
        imagenModalActual.value = sortedImagenes.value[indiceModalActual.value].url;
    }
}

function nextImagenModal() {
    if (sortedImagenes.value.length > 1) {
        indiceModalActual.value = (indiceModalActual.value + 1) % sortedImagenes.value.length;
        imagenModalActual.value = sortedImagenes.value[indiceModalActual.value].url;
    }
}

onMounted(() => {
    const handleKeydown = (e) => {
        if (e.key === 'Escape' && modalAbierto.value) {
            cerrarModal();
        }
        if (modalAbierto.value && sortedImagenes.value.length > 1) {
            if (e.key === 'ArrowLeft') {
                prevImagenModal();
            } else if (e.key === 'ArrowRight') {
                nextImagenModal();
            }
        }
    };

    document.addEventListener('keydown', handleKeydown);

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown);
        document.body.style.overflow = '';
    });
});
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

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>