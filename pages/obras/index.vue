<template>
    <DefaultSection
        class="bg-[url('/images/backgrounds/Flores-Andy-Loisch.jpg')] bg-cover bg-center bg-no-repeat pt-20 md:pt-32 xl:pt-44 px-5 md:px-10 xl:px-20 pb-72">
        <DefaultContent class="flex flex-col items-center gap-3 md:gap-5 xl:gap-8">
            <h1 class="text-xl md:text-[2rem] xl:text-[2.5rem] text-center font-medium text-light">MIS OBRAS</h1>

            <div class="w-full flex flex-col xl:flex-row items-center gap-3">
                <div class="w-full flex flex-col md:flex-row items-center gap-3">
                    <button v-for="categoria in categorias" :key="categoria.id" @click="toggleCategoria(categoria.id)"
                        :class="[
                            'w-full border border-light xl:hover:bg-primary rounded-[8px] md:rounded-[12px] text-light text-sm md:text-lg xl:text-2xl 2xl:text-[1.75rem] transition-colors duration-300 py-3 md:py-4 xl:py-6',
                            categoriaSeleccionada === categoria.id
                                ? 'bg-primary'
                                : 'bg-secondary'
                        ]">
                        {{ categoria.nombre.toUpperCase() }}
                    </button>
                </div>

                <div class="w-full relative">
                    <label for="buscador" class="sr-only">BUSCÁ UNA OBRA</label>
                    <input type="text" id="buscador" v-model="busqueda" placeholder="BUSCÁ UNA OBRA"
                        class="w-full bg-dark border rounded-[0.625rem] text-xs md:text-sm focus:outline-none pl-10 pr-10 py-3 md:py-4" />
                    <Icon name="tabler:search" size="1.125rem"
                        class="absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <button v-if="busqueda" @click="busqueda = ''"
                        class="flex justify-center items-center absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Icon name="tabler:x" size="1.125rem" />
                    </button>
                </div>
            </div>
        </DefaultContent>
    </DefaultSection>

    <DefaultSection class="relative z-[3] gradient-two-way py-20 md:py-24 xl:py-36 2xl:py-48 px-5 md:px-10 -mt-[18.75rem] md:-mt-[17rem] -mb-[9.5rem] md:-mb-[16rem]">
        <DefaultContent>
            <ClientOnly v-if="obrasStore.isLoading">
                <div class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </ClientOnly>

            <ClientOnly v-else-if="obrasFiltradas.length === 0">
                <div class="min-h-screen text-center py-12">
                    <p class="text-lg text-light">No se encontraron obras con los filtros seleccionados</p>
                </div>
            </ClientOnly>

            <ClientOnly v-else>
                <div class="flex flex-wrap justify-center gap-2 md:gap-4 xl:gap-5 2xl:gap-7">
                    <ObraCard v-for="obra in obrasFiltradas" :key="obra.id" :obra="obra"
                        :to="`${ROUTE_NAMES.OBRAS}/${obra.slug}`" />
                </div>
            </ClientOnly>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';
import { useCategoriasStore } from '~/store/categorias';
import { useObrasStore } from '~/store/obras';

const categoriasStore = useCategoriasStore();
const obrasStore = useObrasStore();

const categoriaSeleccionada = ref(null);
const busqueda = ref('');

let unsubscribeObras;
let unsubscribeCategorias;

onMounted(async () => {
    await Promise.all([
        categoriasStore.fetchCategorias(),
        obrasStore.fetchObras()
    ]);

    unsubscribeObras = obrasStore.setupRealtimeUpdates();
    unsubscribeCategorias = categoriasStore.setupRealtimeUpdates();
});

onUnmounted(() => {
    if (unsubscribeObras) unsubscribeObras();
    if (unsubscribeCategorias) unsubscribeCategorias();
});

const categorias = computed(() => categoriasStore.getCategorias);

const obrasFiltradas = computed(() => {
    let obras = obrasStore.getObras;

    if (categoriaSeleccionada.value) {
        obras = obras.filter(obra => obra.categoria_id === categoriaSeleccionada.value);
    }

    if (busqueda.value.trim()) {
        const termino = busqueda.value.toLowerCase().trim();
        obras = obras.filter(obra =>
            obra.titulo?.toLowerCase().includes(termino) ||
            obra.descripcion?.toLowerCase().includes(termino)
        );
    }

    return obras;
});

const toggleCategoria = (categoriaId) => {
    if (categoriaSeleccionada.value === categoriaId) {
        categoriaSeleccionada.value = null;
    } else {
        categoriaSeleccionada.value = categoriaId;
    }
};

watch(categoriaSeleccionada, () => {
    busqueda.value = '';
});
</script>