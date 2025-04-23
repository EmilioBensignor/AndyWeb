<template>
    <header class="w-full fixed top-0 z-10 bg-darkOpacity py-4 px-5" ref="headerRef">
        <DefaultContent class="flex justify-between items-center">
            <button @click.stop="toggleMenu"
                class="relative z-20 w-[1.188rem] h-[0.875rem] flex flex-col justify-between focus-visible:outline-none"
                aria-label="Menú principal">
                <span class="block w-full h-[2px] bg-light transition-transform duration-300"
                    :class="{ 'rotate-45 translate-y-[0.35rem]': isMenuOpen }"></span>
                <span class="block w-full h-[2px] bg-light transition-opacity duration-300"
                    :class="{ 'opacity-0': isMenuOpen }"></span>
                <span class="block w-full h-[2px] bg-light transition-transform duration-300"
                    :class="{ '-rotate-45 -translate-y-[0.35rem]': isMenuOpen }"></span>
            </button>

            <h1 class="text-light text-xl">ANDY LOISCH</h1>

            <NuxtLink to="/" class="flex justify-center items-center relative z-20">
                <NuxtImg src="/images/icons/Andy-Loisch-Textil-Art-Instagram.svg" alt="Andy Loisch Textil Art Instagram"
                    class="w-4 h-4" />
            </NuxtLink>
        </DefaultContent>

        <div class="fixed inset-0 z-10 pointer-events-none" :class="{ 'pointer-events-auto': isMenuOpen }"
            @click="closeMenu"></div>

        <div class="fixed left-0 bottom-0 w-60 bg-darkOpacity transform transition-transform duration-500 ease-out z-10"
            :style="{ top: `${headerHeight}px` }" :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
            @click.stop>
            <div class="pt-6 px-6">
                <nav>
                    <ul class="flex flex-col space-y-6">
                        <li v-for="(item, index) in menuItems" :key="item.path">
                            <NuxtLink :to="item.path"
                                class="text-light text-xl leading-tight block opacity-0 transition-opacity duration-300"
                                :class="{ 'opacity-100 text-red': isMenuOpen }"
                                :style="{ 'transition-delay': `${(index + 1) * 100}ms` }" @click="closeMenu">
                                {{ item.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';

const isMenuOpen = ref(false);
const headerRef = ref(null);
const headerHeight = ref(0);

const menuItems = [
    { label: 'INICIO', path: ROUTE_NAMES.HOME },
    { label: 'OBRAS', path: ROUTE_NAMES.OBRAS },
    { label: 'INSPIRACIÓN', path: ROUTE_NAMES.INSPIRACIONES }
];

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const handleEscKey = (event) => {
    if (event.key === 'Escape' && isMenuOpen.value) {
        closeMenu();
    }
};

const updateHeaderHeight = () => {
    if (headerRef.value) {
        headerHeight.value = headerRef.value.offsetHeight;
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleEscKey);
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscKey);
    window.removeEventListener('resize', updateHeaderHeight);
});
</script>