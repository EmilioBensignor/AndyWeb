<template>
    <DefaultSection class="bg-[url('/images/backgrounds/Flores-Andy-Loisch.jpg')] bg-cover bg-center bg-no-repeat">
        <div class="pt-[3.75rem] md:pt-[7.5rem] px-5 md:px-10 pb-[7.5rem] md:pb-[12.5rem]">
            <DefaultContent class="scroll-reveal">
                <h2 class="text-xl md:text-4xl tracking-widest text-light">
                    <span class="text-[hsl(0_0%_100%_/_0.2)] bg-clip-text">
                        ESTA ES UNA FRASE SOBRE
                        INSPIRACION, ARTE Y VIDA COTIDIANA
                    </span>
                </h2>
            </DefaultContent>
        </div>
    </DefaultSection>
</template>

<style scoped>
.scroll-reveal span {
    background-repeat: no-repeat;
    background-size: 0% 100%;
    background-image: linear-gradient(90deg, red, red);
    animation: scroll-reveal linear forwards;
    animation-timeline: view();
}

.scroll-reveal h2 span {
    animation-range-start: contain 30vh;
    animation-range-end: contain 60vh;
}

@keyframes scroll-reveal {
    to {
        background-size: 100% 100%;
    }
}
</style>