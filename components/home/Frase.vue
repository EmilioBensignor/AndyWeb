<template>
    <DefaultSection class="bg-[url('/images/backgrounds/Textura-Andy-Loisch.png')] bg-cover bg-center bg-no-repeat">
        <div class="pt-16 md:pt-32 xl:pt-40 px-5 md:px-10 xl:px-20 2xl:px-32 pb-32 md:pb-52 xl:pb-72">
            <DefaultContent class="scroll-reveal">
                <h2 class="text-xl md:text-4xl xl:text-[2.5rem] 2xl:text-[3.25rem] xl:leading-none tracking-widest text-light">
                    <span class="text-[hsl(0_0%_100%_/_0.2)] bg-clip-text">
                        CADA OBRA, ES UN PEDACITO DE MI MUNDO, MIS VIAJES, MIS RECUERDOS.
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
    background-image: linear-gradient(90deg, white, white);
    animation: scroll-reveal linear forwards;
    animation-timeline: view();
}

.scroll-reveal h2 span {
    animation-range-start: contain 15vh;
    animation-range-end: contain 40vh;
}

@keyframes scroll-reveal {
    to {
        background-size: 100% 100%;
    }
}
</style>