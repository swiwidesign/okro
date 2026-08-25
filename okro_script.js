window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    let lenis;

    // LENIS
    if (Webflow.env("editor") === undefined) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1,
            wheelMultiplier: 0.7,
            infinite: false,
            gestureOrientation: "vertical",
            normalizeWheel: false,
            smoothTouch: false
        });

        lenis.on("scroll", ScrollTrigger.update);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll("[data-lenis-stop]").forEach((el) =>
        el.addEventListener("click", () => {
            if (lenis) lenis.stop();
        })
    );

    document.querySelectorAll("[data-lenis-start]").forEach((el) =>
        el.addEventListener("click", () => {
            if (lenis) lenis.start();
        })
    );

    // Lumos nav checkbox
    const lenisToggle = document.querySelector("[data-lenis-toggle]");

    if (lenisToggle) {
        lenisToggle.addEventListener("change", () => {
            if (!lenis) return;

            lenisToggle.checked ? lenis.stop() : lenis.start();
        });
    }

    // LANDING
    const logo = '[data-logo="True"]';

    gsap.to(logo, {
        width: "7.75rem",
        marginTop: "0vh",
        yPercent: 0,
        bottom: "auto",
        ease: "none",

        scrollTrigger: {
            trigger: ".landing_hero_section",
            start: "top top",
            end: "bottom center",
            scrub: true,
            invalidateOnRefresh: true,

            onLeave: () => {
                gsap.set(logo, {
                    mixBlendMode: "difference",
                    color: "var(--_theme---text)"
                });
            },

            onEnterBack: () => {
                gsap.set(logo, {
                    mixBlendMode: "normal",
                    color: "var(--_theme---text)"
                });
            }
        }
    });

    // Reveal flicker elements
    document.documentElement.setAttribute("data-flicker-ready", "");

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    document.fonts?.ready.then(() => {
        ScrollTrigger.refresh();
    });
});
