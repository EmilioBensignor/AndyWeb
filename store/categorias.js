import { defineStore } from 'pinia';
import { useSupabaseCache } from '~/composables/useSupabaseCache';

export const useCategoriasStore = defineStore('categorias', {
    state: () => ({
        categorias: [],
        loading: false,
        error: null,
        subscription: null
    }),

    getters: {
        getCategorias: (state) => state.categorias,
        isLoading: (state) => state.loading,
    },

    actions: {
        async fetchCategorias() {
            this.loading = true;

            if (process.client) {
                const { getFromCache, saveToCache } = useSupabaseCache();
                const cacheKey = 'categorias_data';

                const cachedData = getFromCache(cacheKey);
                if (cachedData) {
                    this.categorias = cachedData;
                    this.refreshCategoriasInBackground();
                    this.loading = false;
                    return this.categorias;
                }
            }

            try {
                const supabase = useSupabaseClient();
                const { data, error } = await supabase
                    .from('categorias')
                    .select('id, nombre')
                    .order('nombre');

                if (error) throw error;

                this.categorias = data;

                if (process.client) {
                    const { saveToCache } = useSupabaseCache();
                    saveToCache('categorias_data', data, 60);
                }

                return this.categorias;
            } catch (error) {
                this.error = error.message;
                console.error('Error al cargar categorías:', error);
                return [];
            } finally {
                this.loading = false;
            }
        },

        async refreshCategoriasInBackground() {
            if (!process.client) return;

            try {
                const supabase = useSupabaseClient();
                const { data, error } = await supabase
                    .from('categorias')
                    .select('id, nombre')
                    .order('nombre');

                if (error) throw error;

                const { saveToCache } = useSupabaseCache();
                this.categorias = data;
                saveToCache('categorias_data', data, 60);
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
                .channel('categorias-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'categorias'
                }, (payload) => {
                    this.handleCategoriaChanges(payload);
                })
                .subscribe();

            return () => {
                if (this.subscription) {
                    this.subscription.unsubscribe();
                    this.subscription = null;
                }
            };
        },

        handleCategoriaChanges(payload) {
            if (payload.eventType === 'INSERT') {
                const newCategoria = payload.new;
                this.categorias = [...this.categorias, newCategoria].sort((a, b) =>
                    a.nombre.localeCompare(b.nombre)
                );

                if (process.client) {
                    const { getFromCache, saveToCache } = useSupabaseCache();
                    const cachedData = getFromCache('categorias_data');
                    if (cachedData) {
                        saveToCache('categorias_data',
                            [...cachedData, newCategoria].sort((a, b) =>
                                a.nombre.localeCompare(b.nombre)
                            ),
                            60
                        );
                    }
                }
            }
            else if (payload.eventType === 'UPDATE') {
                const updatedCategoria = payload.new;
                this.categorias = this.categorias
                    .map(item => item.id === updatedCategoria.id ? updatedCategoria : item)
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));

                if (process.client) {
                    const { getFromCache, saveToCache } = useSupabaseCache();
                    const cachedData = getFromCache('categorias_data');
                    if (cachedData) {
                        saveToCache('categorias_data',
                            cachedData
                                .map(item => item.id === updatedCategoria.id ? updatedCategoria : item)
                                .sort((a, b) => a.nombre.localeCompare(b.nombre)),
                            60
                        );
                    }
                }
            }
            else if (payload.eventType === 'DELETE') {
                const deletedId = payload.old.id;
                this.categorias = this.categorias.filter(item => item.id !== deletedId);

                if (process.client) {
                    const { getFromCache, saveToCache } = useSupabaseCache();
                    const cachedData = getFromCache('categorias_data');
                    if (cachedData) {
                        saveToCache('categorias_data',
                            cachedData.filter(item => item.id !== deletedId),
                            60
                        );
                    }
                }
            }
        }
    }
});