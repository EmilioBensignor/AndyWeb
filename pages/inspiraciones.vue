<template>
    <DefaultSection
        class="bg-[url('/images/backgrounds/Flores-Andy-Loisch.jpg')] bg-cover bg-center bg-no-repeat pt-20 md:pt-32 xl:pt-44 px-5 md:px-10 xl:px-20 pb-72">
        <DefaultContent class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2">
                <DefaultH1>INSPIRACIONES</DefaultH1>
                <p class="text-center text-xs">
                    VIAJO, DESCUBRO, OBSERVO Y CAPTURO. CADA RINCÓN ES UNA NUEVA IDEA.
                </p>
            </div>

            <div class="w-full md:max-w-[780px] flex flex-col items-center gap-3">
                <div
                    class="w-full max-w-[400px] md:max-w-full flex flex-wrap justify-center md:justify-between gap-[0.625rem]">
                    <button v-for="color in ordenarColoresPorPosicion(coloresOptions)" :key="color.value" type="button"
                        class="w-9 h-9 lg:w-12 lg:h-12 last-of-type:border last-of-type:border-light rounded-md transition-all duration-300 relative shadow-md p-1"
                        :style="{
                            backgroundColor: color.hex,
                            transform: colorSeleccionado === color.value ? 'rotate(45deg)' : ''
                        }" @click="filtrarPorColor(color)">
                        
                    </button>
                </div>
                <button v-if="colorSeleccionado" @click="limpiarFiltro"
                    class="text-white underline transition-all hover:opacity-80">
                    Limpiar filtro
                </button>
            </div>
        </DefaultContent>
    </DefaultSection>

    <DefaultSection
        class="min-h-[35vh] relative z-[3] gradient-two-way py-20 md:py-24 xl:py-36 2xl:py-48 px-5 md:px-10 -mt-[16rem] md:-mt-[17rem] -mb-[8rem] md:-mb-[16rem]">
        <DefaultContent>
            <ClientOnly>
                <div v-if="isLoading" class="w-full flex justify-center">
                    <div class="flex items-center">
                        <p>Cargando inspiraciones...</p>
                    </div>
                </div>

                <div v-else-if="inspiraciones.length === 0" class="text-center">
                    <p>No hay inspiraciones disponibles.</p>
                </div>

                <div v-else class="flex flex-wrap justify-center gap-2 md:gap-4 xl:gap-5 2xl:gap-7">
                    <div v-for="inspiracion in inspiraciones" :key="inspiracion.id"
                        class="w-[48.5%] md:w-[31.25%] xl:w-[23.25%] min-h-[172px] md:max-h-[230px] 2xl:max-h-[300px] border border-light">
                        <img :src="inspiracion.imagen_url" :alt="`${inspiracion.image_url} - Andy Loisch`"
                            class="w-full h-full object-cover" />
                    </div>
                </div>
            </ClientOnly>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { useInspiracionesStore } from '~/store/inspiraciones';
import { useColoresStore } from '~/store/colores';

const inspiracionesStore = useInspiracionesStore();
const coloresStore = useColoresStore();
const { $toast } = useNuxtApp();

const isLoading = ref(false);
const colorSeleccionado = ref(null);

const unsubscribeCallbacks = ref({
    inspiraciones: null,
    colores: null
});

onUnmounted(() => {
    if (unsubscribeCallbacks.value.inspiraciones) {
        unsubscribeCallbacks.value.inspiraciones();
    }
    if (unsubscribeCallbacks.value.colores) {
        unsubscribeCallbacks.value.colores();
    }
});

onMounted(async () => {
    isLoading.value = true;
    try {
        await Promise.all([
            inspiracionesStore.fetchInspiraciones(),
            coloresStore.fetchColores()
        ]);

        unsubscribeCallbacks.value.inspiraciones = inspiracionesStore.setupRealtimeUpdates();
        unsubscribeCallbacks.value.colores = coloresStore.setupRealtimeUpdates();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        $toast?.error('No se pudieron cargar las inspiraciones');
    } finally {
        isLoading.value = false;
    }
});

const inspiraciones = computed(() => {
    return inspiracionesStore.getInspiraciones;
});

const coloresOptions = computed(() => {
    return coloresStore.getColoresAsOptions;
});

const ordenarColoresPorPosicion = (colores) => {
    return [...colores].sort((a, b) => a.posicion - b.posicion);
};

const filtrarPorColor = async (color) => {
    if (colorSeleccionado.value === color.value) {
        return limpiarFiltro();
    }

    isLoading.value = true;
    try {
        colorSeleccionado.value = color.value;
        await inspiracionesStore.fetchInspiracionesPorColor(color.value);
    } catch (error) {
        console.error('Error al filtrar por color:', error);
        $toast?.error(`Error al filtrar por color: ${error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const limpiarFiltro = async () => {
    isLoading.value = true;
    try {
        colorSeleccionado.value = null;
        await inspiracionesStore.fetchInspiraciones();
    } catch (error) {
        console.error('Error al limpiar filtro:', error);
        $toast?.error(`Error al limpiar filtro: ${error.message}`);
    } finally {
        isLoading.value = false;
    }
};
</script>