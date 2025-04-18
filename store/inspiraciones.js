import { defineStore } from 'pinia';

export const useInspiracionesStore = defineStore('inspiraciones', {
    state: () => ({
        inspiraciones: [],
        isLoading: false,
        error: null,
        subscription: null
    }),

    getters: {
        getInspiraciones: (state) => state.inspiraciones,
        getInspiracionById: (state) => (id) => state.inspiraciones.find(inspiracion => inspiracion.id === id)
    },

    actions: {
        async fetchInspiraciones() {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('inspiraciones')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                this.inspiraciones = data || [];
                return data;
            } catch (error) {
                console.error('Error al obtener inspiraciones:', error);
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchInspiracionesPorColor(colorId) {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('inspiraciones_colores')
                    .select(`
                        inspiracion_id,
                        inspiraciones:inspiracion_id(*)
                    `)
                    .eq('color_id', colorId);

                if (error) throw error;

                const inspiracionesData = data.map(item => item.inspiraciones);
                this.inspiraciones = inspiracionesData || [];
                return inspiracionesData;
            } catch (error) {
                console.error(`Error al obtener inspiraciones con color ID ${colorId}:`, error);
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchInspiracionById(id) {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('inspiraciones')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                return data;
            } catch (error) {
                console.error(`Error al obtener inspiración con ID ${id}:`, error);
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        setupRealtimeUpdates() {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }

            const supabase = useSupabaseClient();

            this.subscription = supabase
                .channel('inspiraciones-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'inspiraciones'
                }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        this.inspiraciones.unshift(payload.new);
                    } else if (payload.eventType === 'UPDATE') {
                        const index = this.inspiraciones.findIndex(inspiracion => inspiracion.id === payload.new.id);
                        if (index !== -1) {
                            this.inspiraciones[index] = payload.new;
                        }
                    } else if (payload.eventType === 'DELETE') {
                        this.inspiraciones = this.inspiraciones.filter(inspiracion => inspiracion.id !== payload.old.id);
                    }
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