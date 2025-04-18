import { defineStore } from 'pinia';

export const useObrasStore = defineStore('obras', {
    state: () => ({
        obras: [],
        isLoading: false,
        error: null,
        subscription: null
    }),

    getters: {
        getObras: (state) => state.obras,
        getObraById: (state) => (id) => state.obras.find(obra => obra.id === id)
    },

    actions: {
        async fetchObras() {
            this.isLoading = true;
            this.error = null;

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
                return processedData;
            } catch (error) {
                console.error('Error al obtener obras:', error);
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchObraById(id) {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await useSupabaseClient()
                    .from('obras')
                    .select(`
                        *,
                        categorias(id, nombre),
                        obras_imagenes(id, url, posicion, es_principal)
                    `)
                    .eq('id', id)
                    .single();

                if (error) throw error;

                const imagenes = data.obras_imagenes ? data.obras_imagenes.map(img => img.url) : [];

                const imagenPrincipal = data.obras_imagenes ?
                    data.obras_imagenes.find(img => img.es_principal)?.url : null;

                const processedData = {
                    ...data,
                    imagenes,
                    imagen_url: imagenPrincipal || (imagenes.length > 0 ? imagenes[0] : null),
                    categoria: data.categorias ? data.categorias.nombre : null,
                    categoria_id: data.categoria_id || (data.categorias ? data.categorias.id : null)
                };

                return processedData;
            } catch (error) {
                console.error(`Error al obtener obra con ID ${id}:`, error);
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
                .channel('obras-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'obras'
                }, (payload) => {
                    this.handleObraChanges(payload, supabase);
                })
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'obras_imagenes'
                }, (payload) => {
                    this.handleObraImagenChanges(payload, supabase);
                })
                .subscribe();

            return () => {
                if (this.subscription) {
                    this.subscription.unsubscribe();
                    this.subscription = null;
                }
            };
        },
    }
});