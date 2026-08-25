window.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // WEBFLOW EDITOR
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

    gsap.ticker.lagSmoothing(0);


    // ==================================================
    // LENIS CONTROLS
    // ==================================================

    document.querySelectorAll("[data-lenis-stop]").forEach((el) => {
        el.addEventListener("click", () => {
            lenis.stop();
        });
    });


    document.querySelectorAll("[data-lenis-start]").forEach((el) => {
        el.addEventListener("click", () => {
            lenis.start();
        });
    });


    // Lumos checkbox toggle
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
    // LANDING LOGO
    // ==================================================

    const logo = document.querySelector('[data-logo="True"]');
    const landingHero = document.querySelector(".landing_hero_section");


    if (logo && landingHero) {


        // --------------------------------------------------
        // Set initial state BEFORE animation
        // --------------------------------------------------

        gsap.set(logo, {
            width: "7.75rem",
            marginTop: "0vh",
            yPercent: 0,
            bottom: "auto"
        });


        // --------------------------------------------------
        // Logo movement
        // --------------------------------------------------

        gsap.to(logo, {
            width: "7.75rem",
            marginTop: "0vh",
            yPercent: 0,
            bottom: "auto",
            ease: "none",

            scrollTrigger: {
                trigger: landingHero,

                start: "top top",
                end: "bottom center",

                scrub: true,

                invalidateOnRefresh: true
            }
        });


        // --------------------------------------------------
        // Logo appearance
        // --------------------------------------------------

        ScrollTrigger.create({
            trigger: landingHero,

            start: "top top",
            end: "bottom center",

            onEnter: () => {

                gsap.set(logo, {
                    mixBlendMode: "normal",
                    color: "var(--_theme---text)"
                });

            },

            onLeave: () => {

                gsap.set(logo, {
                    mixBlendMode: "difference",
                    color: "var(--_theme---background)"
                });

            },

            onEnterBack: () => {

                gsap.set(logo, {
                    mixBlendMode: "normal",
                    color: "var(--_theme---text)"
                });

            },

            onLeaveBack: () => {

                gsap.set(logo, {
                    mixBlendMode: "normal",
                    color: "var(--_theme---text)"
                });

            }
        });

    }


    // ==================================================
    // SCROLLTRIGGER REFRESH
    // ==================================================

    ScrollTrigger.refresh();


    // Refresh after page load
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });


    // Refresh after fonts have loaded
    if (document.fonts) {
        document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
        });
    }

});
