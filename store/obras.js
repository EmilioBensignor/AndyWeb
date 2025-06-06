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
        },

        async fetchObraBySlug(slug) {
            try {
                const existingObra = this.obras.find(o => o.slug === slug);
                if (existingObra) {
                    return { obra: existingObra, error: null };
                }

                if (this.obras.length === 0 && !this.isLoading) {
                    console.log(`Store vacío, cargando todas las obras para encontrar "${slug}"`);
                    await this.fetchObras();

                    const obraEncontrada = this.obras.find(o => o.slug === slug);
                    if (obraEncontrada) {
                        return { obra: obraEncontrada, error: null };
                    }
                }

                console.log(`Obra "${slug}" no encontrada en store, haciendo fetch individual`);

                const supabase = useSupabaseClient();
                const { data, error: supabaseError } = await supabase
                    .from('obras')
                    .select(`
                *,
                categorias(id, nombre),
                obras_imagenes(id, url, posicion, es_principal)
            `)
                    .eq('slug', slug)
                    .single();

                if (supabaseError) {
                    console.error(`Error buscando obra "${slug}":`, supabaseError);
                    return { obra: null, error: `Obra "${slug}" no encontrada` };
                }

                if (!data) {
                    return { obra: null, error: `Obra "${slug}" no existe` };
                }

                const imagenes = data.obras_imagenes ? data.obras_imagenes.map(img => img.url) : [];
                const imagenPrincipal = data.obras_imagenes ?
                    data.obras_imagenes.find(img => img.es_principal)?.url : null;

                const processedObra = {
                    ...data,
                    imagenes,
                    imagen_url: imagenPrincipal || (imagenes.length > 0 ? imagenes[0] : null),
                    categoria: data.categorias ? data.categorias.nombre : null,
                    categoria_id: data.categoria_id || (data.categorias ? data.categorias.id : null)
                };

                const existingIndex = this.obras.findIndex(o => o.id === processedObra.id);
                if (existingIndex === -1) {
                    this.obras.push(processedObra);
                }

                return { obra: processedObra, error: null };

            } catch (err) {
                console.error(`Error crítico buscando obra "${slug}":`, err);
                return { obra: null, error: err.message || 'Error desconocido' };
            }
        }
    }
});