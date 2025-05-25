<template>
    <DefaultSection
        class="bg-[url('/images/backgrounds/Textura-Andy-Loisch.png')] bg-cover bg-center bg-no-repeat pt-20 md:pt-32 xl:pt-44 2xl:pt-52 px-5 md:px-10 xl:px-20 2xl:px-32 pb-72">
        <DefaultContent class="flex flex-col items-center gap-3 md:gap-5 xl:gap-8">
            <DefaultH1>MIS OBRAS</DefaultH1>

            <div class="w-full flex flex-col xl:flex-row items-center gap-3 xl:gap-4">
                <div class="w-full flex flex-col md:flex-row xl:flex-row items-center gap-3 xl:gap-4 xl:transition-all xl:duration-300"
                    :class="[isXL && showSearchXL ? 'xl:w-[50%]' : 'xl:w-[100%]']">
                    <button v-for="categoria in categorias" :key="categoria.id" @click="toggleCategoria(categoria.id)"
                        :class="[
                            'border border-light rounded-[8px] md:rounded-[12px] text-light text-sm md:text-lg xl:text-2xl 2xl:text-[1.75rem] font-medium transition-all duration-300 py-3 md:py-4 xl:py-6 2xl:py-7',
                            categoriaSeleccionada === categoria.id ? 'bg-primary' : 'bg-secondary',
                            'w-full',
                            isXL && showSearchXL ? 'xl:w-[32%]' : ''
                        ]">
                        <span v-if="!(isXL && mostrarAbreviados)">{{ categoria.nombre.toUpperCase() }}</span>
                        <span v-else>{{ abreviar(categoria.nombre).toUpperCase() }}</span>
                    </button>
                </div>

                <div class="w-full xl:relative xl:flex-1">
                    <div v-if="isXL" class="w-full relative">
                        <template v-if="showSearchXL">
                            <label for="buscador" class="sr-only">Buscador</label>
                            <input type="text" id="buscador" v-model="busqueda" placeholder="BUSCÁ UNA OBRA"
                                class="w-full h-[5.125rem] 2xl:h-[5.625rem] bg-dark border border-light rounded-[12px] xl:text-2xl 2xl:text-[1.75rem] xl:py-5 focus:outline-none transition-all duration-300 py-3 pl-14 pr-10" />
                            <Icon name="tabler:search" size="2rem"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-light" />
                            <button @click="toggleSearchXL"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-light">
                                <Icon name="tabler:x" size="2rem" />
                            </button>
                        </template>
                        <template v-else>
                            <button @click="toggleSearchXL"
                                class="h-[5.125rem] 2xl:h-[5.625rem] flex justify-center items-center bg-dark border border-light rounded-[12px] py-4 px-9">
                                <Icon name="tabler:search" size="2rem" class="text-light" />
                            </button>
                        </template>
                    </div>

                    <template v-if="!isXL">
                        <div class="relative w-full">
                            <label for="buscador" class="sr-only">Buscador</label>
                            <input type="text" id="buscador" v-model="busqueda" placeholder="BUSCÁ UNA OBRA"
                                class="w-full bg-dark border border-light rounded-[8px] md:rounded-[12px] text-xs md:text-sm focus:outline-none pl-10 pr-10 py-3 md:py-4" />
                            <Icon name="tabler:search" size="1.125rem"
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-light" />
                            <button v-if="busqueda" @click="busqueda = ''"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-light">
                                <Icon name="tabler:x" size="1.125rem" />
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </DefaultContent>
    </DefaultSection>

    <DefaultSection
        class="relative z-[3] gradient-two-way py-20 md:py-20 xl:py-24 2xl:py-32 px-5 md:px-10 -mt-[17rem] md:-mt-[17rem] -mb-[8rem] md:-mb-[16rem]">
        <DefaultContent>
            <ClientOnly>
                <div v-if="obrasStore.isLoading" class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>

                <div v-else-if="obrasFiltradas.length === 0" class="min-h-screen text-center py-12">
                    <p class="text-lg text-light">No se encontraron obras con los filtros seleccionados</p>
                </div>

                <div v-else class="flex flex-wrap justify-center gap-2 md:gap-4 xl:gap-5 2xl:gap-7">
                    <ObraCard v-for="obra in obrasFiltradas" :key="obra.id" :obra="obra"
                        :to="`${ROUTE_NAMES.OBRAS}/${obra.slug}`" />
                </div>
            </ClientOnly>
        </DefaultContent>
    </DefaultSection>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'
import { useCategoriasStore } from '~/store/categorias'
import { useObrasStore } from '~/store/obras'

const categoriasStore = useCategoriasStore()
const obrasStore = useObrasStore()
const route = useRoute()
const router = useRouter()

const categoriaSeleccionada = ref(null)
const busqueda = ref('')
const showSearchXL = ref(false)
const mostrarAbreviados = ref(false)

// Mapeo estático de nombres a slugs
const categoryNameToSlug = {
    "Pequeño formato": "pequeno-formato",
    "Gran formato": "gran-formato",
    "Objeto": "objetos"
}

// Mapeo inverso de slugs a nombres
const categorySlugToName = {
    "pequeno-formato": "Pequeño formato",
    "gran-formato": "Gran formato",
    "objetos": "Objeto"
}

// Función para obtener UUID por nombre de categoría
const getCategoryIdByName = (categoryName) => {
    const categorias = categoriasStore.getCategorias
    const categoria = categorias.find(cat => cat.nombre === categoryName)
    return categoria ? categoria.id : null
}

// Función para obtener nombre por UUID de categoría  
const getCategoryNameById = (categoryId) => {
    const categorias = categoriasStore.getCategorias
    const categoria = categorias.find(cat => cat.id === categoryId)
    return categoria ? categoria.nombre : null
}

// Función para inicializar categoría desde query params (opcional)
const initializeCategoryFromQuery = () => {
    const categorySlug = route.query.categoria
    if (categorySlug && categorySlugToName[categorySlug]) {
        const categoryName = categorySlugToName[categorySlug]
        const categoryId = getCategoryIdByName(categoryName)
        if (categoryId) {
            categoriaSeleccionada.value = categoryId
            console.log(`[Obras] Categoría inicializada desde query: ${categorySlug} -> ${categoryName} -> ID: ${categoryId}`)
        }
    }
    // Si no hay query param, categoriaSeleccionada.value permanece null (sin filtros)
}

// Función para actualizar URL cuando cambia la categoría (opcional)
const updateUrlWithCategory = (categoryId) => {
    const newQuery = { ...route.query }

    if (categoryId) {
        const categoryName = getCategoryNameById(categoryId)
        if (categoryName && categoryNameToSlug[categoryName]) {
            newQuery.categoria = categoryNameToSlug[categoryName]
        }
    } else {
        // Si no hay categoría seleccionada, remover el query param
        delete newQuery.categoria
    }

    // Solo actualizar si es diferente para evitar navegación innecesaria
    if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
        router.replace({ query: newQuery })
    }
}

const toggleSearchXL = () => {
    if (!showSearchXL.value) {
        mostrarAbreviados.value = true
        setTimeout(() => {
            showSearchXL.value = true
        }, 0)
    } else {
        showSearchXL.value = false
        setTimeout(() => {
            mostrarAbreviados.value = false
        }, 300)
        busqueda.value = ''
    }
}

const isXL = ref(false)

onMounted(() => {
    const updateXL = () => {
        isXL.value = window.innerWidth >= 1080
    }
    updateXL()
    window.addEventListener('resize', updateXL)
    onUnmounted(() => window.removeEventListener('resize', updateXL))
})

let unsubscribeObras
let unsubscribeCategorias

onMounted(async () => {
    // Cargar datos
    await Promise.all([
        categoriasStore.fetchCategorias(),
        obrasStore.fetchObras()
    ])

    // Inicializar categoría desde query después de cargar las categorías
    nextTick(() => {
        initializeCategoryFromQuery()
    })

    // Setup realtime updates
    unsubscribeObras = obrasStore.setupRealtimeUpdates()
    unsubscribeCategorias = categoriasStore.setupRealtimeUpdates()
})

onUnmounted(() => {
    if (unsubscribeObras) unsubscribeObras()
    if (unsubscribeCategorias) unsubscribeCategorias()
})

const categorias = computed(() => categoriasStore.getCategorias)

const obrasFiltradas = computed(() => {
    let obras = obrasStore.getObras

    // Filtrar por categoría solo si hay una seleccionada
    if (categoriaSeleccionada.value) {
        obras = obras.filter(obra => obra.categoria_id === categoriaSeleccionada.value)
    }

    // Filtrar por búsqueda solo si hay texto
    if (busqueda.value.trim()) {
        const termino = busqueda.value.toLowerCase().trim()
        obras = obras.filter(obra =>
            obra.titulo?.toLowerCase().includes(termino) ||
            obra.descripcion?.toLowerCase().includes(termino)
        )
    }

    return obras
})

const toggleCategoria = (categoriaId) => {
    if (categoriaSeleccionada.value === categoriaId) {
        categoriaSeleccionada.value = null
    } else {
        categoriaSeleccionada.value = categoriaId
    }
}

// Watchers para mantener sincronizada la URL
watch(categoriaSeleccionada, (newValue) => {
    busqueda.value = ''
    updateUrlWithCategory(newValue)
})

// Watcher para cambios en la query de la ruta (navegación back/forward)
watch(() => route.query.categoria, (newCategorySlug) => {
    if (newCategorySlug && categorySlugToName[newCategorySlug]) {
        const categoryName = categorySlugToName[newCategorySlug]
        const newCategoryId = getCategoryIdByName(categoryName)
        if (newCategoryId !== categoriaSeleccionada.value) {
            categoriaSeleccionada.value = newCategoryId
        }
    } else if (!newCategorySlug && categoriaSeleccionada.value) {
        // Si no hay slug en la query, limpiar la selección
        categoriaSeleccionada.value = null
    }
})

function abreviar(nombre) {
    const mapa = {
        'PEQUEÑO FORMATO': 'PEQUEÑO',
        'GRAN FORMATO': 'GRAN',
        'OBJETOS': 'OBJETOS',
        'OBJETO': 'OBJETO'
    }
    return mapa[nombre.toUpperCase()] || nombre
}
</script>