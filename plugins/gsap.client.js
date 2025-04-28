// plugins/gsap.client.js
import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
    // Solo registramos el plugin en el cliente, no en el servidor
    if (process.client) {
        gsap.registerPlugin(ScrollTrigger)
    }

    return {
        provide: {
            gsap,
            ScrollTrigger
        }
    }
})