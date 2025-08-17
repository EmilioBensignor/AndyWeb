export default defineNuxtPlugin(async (nuxtApp) => {
    // Solo ejecutar en el cliente
    if (import.meta.server) return;
    
    // Usar nextTick para asegurar que Pinia esté inicializada
    await nextTick();
    
    const user = useSupabaseUser();

    if (user.value) {
        try {
            // Importar dinámicamente para asegurar que Pinia esté disponible
            const { useObrasStore } = await import("~/store/obras");
            const { useInspiracionesStore } = await import("~/store/inspiraciones");
            
            const obrasStore = useObrasStore();
            const inspiracionesStore = useInspiracionesStore();

            await Promise.all([
                obrasStore.fetchObras(),
                inspiracionesStore.fetchInspiraciones()
            ]);

            const unsubscribeObras = obrasStore.setupRealtimeUpdates();
            const unsubscribeInspiraciones = inspiracionesStore.setupRealtimeUpdates();

            nuxtApp.hook('app:beforeDestroy', () => {
                unsubscribeObras && unsubscribeObras();
                unsubscribeInspiraciones && unsubscribeInspiraciones();
            });

        } catch (error) {
            console.error('❌ Error al precargar datos:', error);
        }
    }
});