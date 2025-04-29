import { defineStore } from 'pinia';
import { useSupabaseCache } from '~/composables/useSupabaseCache';

export const useObrasStore = defineStore('obras', {
    state: () => ({
        obras: [],
        isLoading: false,
        error: null,
        subscription: null
    }),

    getters: {
        getObras: (state) => state.obras,
        getObraById: (state) => (id) => state.obras.find(obra => obra.id === id),
        getObrasByCategoria: (state) => (categoriaId) => {
            if (!categoriaId) return state.obras;
            return state.obras.filter(obra => obra.categoria_id === categoriaId);
        },
        getObrasByBusqueda: (state) => (busqueda) => {
            if (!busqueda) return state.obras;
            const termino = busqueda.toLowerCase();
            return state.obras.filter(obra =>
                obra.titulo?.toLowerCase().includes(termino) ||
                obra.descripcion?.toLowerCase().includes(termino)
            );
        }
    },

    actions: {
        async fetchObras() {
            this.isLoading = true;
            this.error = null;

            if (process.client) {
                const { getFromCache, saveToCache } = useSupabaseCache();
                const cacheKey = 'obras_data';

                const cachedData = getFromCache(cacheKey);
                if (cachedData) {
                    this.obras = cachedData;
                    this.refreshObrasInBackground();
                    this.isLoading = false;
                    return this.obras;
                }
            }

            try {
                const { data, error } = await useSupabaseClient()
                    .from('obras')
                    .select(`
                        *,
                        categorias(id, nombre),
                        obras_imagenes(id, url, posicion, es_principal)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const processedData = data.map(obra => {
                    const imagenes = obra.obras_imagenes ? obra.obras_imagenes.map(img => img.url) : [];

                    const imagenPrincipal = obra.obras_imagenes ?
                        obra.obras_imagenes.find(img => img.es_principal)?.url : null;

                    return {
                        ...obra,
                        imagenes,
                        imagen_url: imagenPrincipal || (imagenes.length > 0 ? imagenes[0] : null),
                        categoria: obra.categorias ? obra.categorias.nombre : null,
                        categoria_id: obra.categoria_id || (obra.categorias ? obra.categorias.id : null)
                    };
                });

                this.obras = processedData || [];

                if (process.client) {
                    const { saveToCache } = useSupabaseCache();
                    saveToCache('obras_data', processedData, 60);
                }

                return processedData;
            } catch (error) {
                console.error('Error al obtener obras:', error);
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async refreshObrasInBackground() {
            if (!process.client) return;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('obras')
                    .select(`
                        *,
                        categorias(id, nombre),
                        obras_imagenes(id, url, posicion, es_principal)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const processedData = data.map(obra => {
                    const imagenes = obra.obras_imagenes ? obra.obras_imagenes.map(img => img.url) : [];

                    const imagenPrincipal = obra.obras_imagenes ?
                        obra.obras_imagenes.find(img => img.es_principal)?.url : null;

                    return {
                        ...obra,
                        imagenes,
                        imagen_url: imagenPrincipal || (imagenes.length > 0 ? imagenes[0] : null),
                        categoria: obra.categorias ? obra.categorias.nombre : null,
                        categoria_id: obra.categoria_id || (obra.categorias ? obra.categorias.id : null)
                    };
                });

                this.obras = processedData || [];

                const { saveToCache } = useSupabaseCache();
                saveToCache('obras_data', processedData, 60);
            } catch (error) {
                console.error('Error en actualización en segundo plano:', error);
            }
        },

        setupRealtimeUpdates() {
            if (!process.client) return () => { };

            if (this.subscription) {
                this.subscription.unsubscribe();
            }

            const supabase = useSupabaseClient();

            this.subscription = supabase
                .channel('obras-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'obras'
                }, async (payload) => {
                    // Realizar una nueva consulta completa para obtener datos actualizados
                    // incluyendo relaciones
                    await this.fetchObras();
                })
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'obras_imagenes'
                }, async (payload) => {
                    // Realizar una nueva consulta completa para obtener datos actualizados
                    // incluyendo relaciones
                    await this.fetchObras();
                })
                .subscribe();

            return () => {
                if (this.subscription) {
                    this.subscription.unsubscribe();
                    this.subscription = null;
                }
            };
        }
    }
});