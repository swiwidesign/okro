window.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------
    // GSAP
    // --------------------------------------------------

    gsap.registerPlugin(ScrollTrigger);


    // --------------------------------------------------
    // LENIS
    // --------------------------------------------------

    const lenis = new Lenis({
        autoRaf: false
    });

    // Keep ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Prevent GSAP from adding its own lag compensation
    gsap.ticker.lagSmoothing(0);


    // --------------------------------------------------
    // LENIS CONTROLS
    // --------------------------------------------------

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


    // Lumos nav checkbox
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


    // --------------------------------------------------
    // LANDING
    // --------------------------------------------------

    const logo = document.querySelector('[data-logo="True"]');
    const hero = document.querySelector(".landing_hero_section");

    if (logo && hero) {

        // Where the logo ends up: whatever .nav_logo_wrap looks like
        // with .is-landing switched off. Measured, so the Webflow
        // classes stay the only place those values live.
        let resting = {};

        function measure() {
            gsap.set(logo, { clearProps: "width,y,color,mixBlendMode" });

            // GSAP reads the CSS translate(0, -65%) as pixels,
            // so the target has to be pixels too.
            const startY = gsap.getProperty(logo, "y");
            const startTop = logo.getBoundingClientRect().top;

            logo.classList.remove("is-landing");

            const box = logo.getBoundingClientRect();
            const css = getComputedStyle(logo);

            resting = {
                width: box.width,
                y: startY + (box.top - startTop),
                color: css.color,
                blend: css.mixBlendMode
            };

            logo.classList.add("is-landing");
        }

        // Colours don't scrub, they flip: .is-landing's own colours over
        // the hero, .nav_logo_wrap's once past it.
        function syncColors(self) {
            gsap.set(logo, self.progress >= 1
                ? { color: resting.color, mixBlendMode: resting.blend }
                : { clearProps: "color,mixBlendMode" }
            );
        }

        measure();

        const landing = gsap.to(logo, {
            width: () => resting.width,
            y: () => resting.y,
            ease: "none",
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom center",
                scrub: true,
                invalidateOnRefresh: true,

                onRefreshInit: measure,
                onLeave: syncColors,
                onEnterBack: syncColors
            }
        });

        // Those callbacks don't fire on a refresh (or a reload mid-page).
        syncColors(landing.scrollTrigger);
        ScrollTrigger.addEventListener("refresh", () => syncColors(landing.scrollTrigger));
    }


    // --------------------------------------------------
    // FLICKER
    // --------------------------------------------------

    // Tell CSS that GSAP/Lenis are ready
    document.documentElement.setAttribute(
        "data-flicker-ready",
        ""
    );


    // --------------------------------------------------
    // REFRESH
    // --------------------------------------------------

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    // Refresh once fonts have settled
    if (document.fonts) {
        document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
        });
    }

});
