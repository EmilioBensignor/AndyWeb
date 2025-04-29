<template>
    <DefaultSection class="relative z-[3] bg-gradient-to-b from-[rgba(25,25,25,0)] from-0% to-[rgba(25,25,25,1)] to-10% pt-20 px-5 pb-44">
        <DefaultContent class="flex flex-col gap-6">
            <ClientOnly>
                <NuxtLink :to="ROUTE_NAMES.OBRAS" class="flex items-center gap-3 text-xs">
                    <Icon name="tabler:arrow-narrow-left" size="1.5rem" />
                    VOLVER A OBRAS
                </NuxtLink>
                <div v-if="isLoading" class="flex justify-center items-center py-32">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>

                <div v-else-if="error" class="py-32 text-center">
                    <h1 class="text-2xl text-light mb-4">Error al cargar la obra</h1>
                    <p class="text-light">{{ error }}</p>

                </div>

                <div v-else-if="!obra" class="py-32 text-center">
                    <h1 class="text-2xl text-light mb-4">Obra no encontrada</h1>
                </div>

                <div v-else class="flex flex-col gap-6">
                    <div class="flex flex-col gap-4">
                        <div class="w-max bg-secondary border border-light rounded-full py-[0.625rem] px-6">
                            <p class="text-sm font-medium">{{ obra.categoria.toUpperCase() }}</p>
                        </div>
                        <h1 class="text-2xl">{{ obra.titulo.toUpperCase() }}</h1>
                    </div>
                    <div>
                        <!-- TODO: Hacer galeria de imagenes con v-if -->
                        <NuxtImg :src="obra.imagen_url" />
                    </div>
                    <div class="flex flex-col gap-5">
                        <p class="text-sm">{{ obra.descripcion }}</p>
                        <p class="text-sm">{{ obra.ancho }} x {{ obra.alto }} cm</p>
                        <p class="text-sm">{{ obra.anio }}</p>
                    </div>
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

onMounted(async () => {
    try {
        const obras = obrasStore.getObras;
        if (obras.length > 0) {
            obra.value = obras.find(o => o.slug === slug);
            if (obra.value) {
                isLoading.value = false;
                return;
            }
        }

        const { obra: fetchedObra, error: fetchError } = await obrasStore.fetchObraBySlug(slug);

        if (fetchError) {
            throw fetchError;
        }

        obra.value = fetchedObra;
    } catch (err) {
        error.value = err.message || 'Error al cargar la obra';
    } finally {
        isLoading.value = false;
    }
});
</script>