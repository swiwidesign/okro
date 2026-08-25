window.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // WEBFLOW EDITOR CHECK
    // ==================================================

    if (Webflow.env("editor") !== undefined) {
        return;
    }


    // ==================================================
    // GSAP
    // ==================================================

    gsap.registerPlugin(ScrollTrigger);


    // ==================================================
    // LENIS
    // ==================================================

    const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        anchors: true,
        autoRaf: false
    });


    // ==================================================
    // LENIS → SCROLLTRIGGER
    // ==================================================

    lenis.on("scroll", ScrollTrigger.update);


    // ==================================================
    // GSAP → LENIS
    // ==================================================

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Disable GSAP lag smoothing
    gsap.ticker.lagSmoothing(0);


    // ==================================================
    // LENIS CONTROLS
    // ==================================================

    // Stop Lenis
    document.querySelectorAll("[data-lenis-stop]").forEach((el) => {
        el.addEventListener("click", () => {
            lenis.stop();
        });
    });


    // Start Lenis
    document.querySelectorAll("[data-lenis-start]").forEach((el) => {
        el.addEventListener("click", () => {
            lenis.start();
        });
    });


    // Lumos / checkbox toggle
    const lenisToggle = document.querySelector("[data-lenis-toggle]");

    if (lenisToggle) {
        lenisToggle.addEventListener("change", () => {
            if (lenisToggle.checked) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });
    }


    // ==================================================
    // LANDING
    // ==================================================

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

            // Change logo appearance after leaving hero
            onLeave: () => {
                gsap.set(logo, {
                    mixBlendMode: "difference",
                    color: "var(--_theme---background)"
                });
            },

            // Restore logo appearance when scrolling back
            onEnterBack: () => {
                gsap.set(logo, {
                    mixBlendMode: "normal",
                    color: "var(--_theme---text)"
                });
            }
        }
    });


    // ==================================================
    // FLICKER REVEAL
    // ==================================================

    document.documentElement.setAttribute(
        "data-flicker-ready",
        ""
    );


    // ==================================================
    // REFRESH SCROLLTRIGGER
    // ==================================================

    // Initial refresh
    ScrollTrigger.refresh();


    // Refresh after everything has loaded
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });


    // Refresh after webfonts have settled
    document.fonts?.ready.then(() => {
        ScrollTrigger.refresh();
    });

});
