import { defineStore } from 'pinia';

export const useColoresStore = defineStore('colores', {
    state: () => ({
        colores: [],
        isLoading: false,
        error: null,
        subscription: null
    }),

    getters: {
        getColores: (state) => state.colores,
        getColoresAsOptions: (state) => state.colores.map(color => ({
            value: color.id,
            label: color.nombre,
            hex: color.codigo_hex,
            posicion: color.posicion
        })).sort((a, b) => a.posicion - b.posicion)
    },

    actions: {
        async fetchColores() {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('colores')
                    .select('*')
                    .order('posicion');

                if (error) throw error;

                this.colores = data || [];
                return data;
            } catch (error) {
                console.error('Error al obtener colores:', error);
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchColorById(id) {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('colores')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                return data;
            } catch (error) {
                console.error(`Error al obtener color con ID ${id}:`, error);
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async getColoresByInspiracionId(inspiracionId) {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('inspiraciones_colores')
                    .select(`
                        color_id,
                        colores:color_id(id, nombre, codigo_hex, posicion)
                    `)
                    .eq('inspiracion_id', inspiracionId)
                    .order('colores(posicion)');

                if (error) throw error;

                return data.map(item => item.colores);
            } catch (error) {
                console.error(`Error al obtener colores de la inspiración ${inspiracionId}:`, error);
                this.error = error;
                return [];
            } finally {
                this.isLoading = false;
            }
        },

        async saveInspiracionColores(inspiracionId, coloresIds) {
            this.isLoading = true;
            this.error = null;

            try {
                const supabase = useSupabaseClient();

                const { error: deleteError } = await supabase
                    .from('inspiraciones_colores')
                    .delete()
                    .eq('inspiracion_id', inspiracionId);

                if (deleteError) throw deleteError;

                if (!coloresIds || coloresIds.length === 0) return { success: true };

                const registrosParaInsertar = coloresIds.map(colorId => ({
                    inspiracion_id: inspiracionId,
                    color_id: colorId
                }));

                const { data, error } = await supabase
                    .from('inspiraciones_colores')
                    .insert(registrosParaInsertar)
                    .select();

                if (error) throw error;

                return { success: true, data };
            } catch (error) {
                console.error(`Error al guardar colores de la inspiración ${inspiracionId}:`, error);
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
                .channel('colores-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'colores'
                }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        this.colores = [...this.colores, payload.new].sort((a, b) =>
                            a.posicion - b.posicion
                        );
                    } else if (payload.eventType === 'UPDATE') {
                        const index = this.colores.findIndex(color => color.id === payload.new.id);
                        if (index !== -1) {
                            this.colores[index] = payload.new;
                            this.colores = [...this.colores].sort((a, b) =>
                                a.posicion - b.posicion
                            );
                        }
                    } else if (payload.eventType === 'DELETE') {
                        this.colores = this.colores.filter(color => color.id !== payload.old.id);
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