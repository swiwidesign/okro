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
    const heroSection = document.querySelector(".landing_hero_section");

    if (logo && heroSection) {

        const LANDING = "is-landing";

        // The resting state is whatever .nav_logo_wrap says, so nothing
        // from Webflow gets duplicated here.
        let endWidth, endY, endColor, endBlend;

        const measure = () => {
            gsap.set(logo, { clearProps: "width,y,yPercent" });

            const startRect = logo.getBoundingClientRect();

            // GSAP reads the CSS translate(0, -65%) as a pixel offset,
            // so the end value has to be a pixel offset too.
            const startY = gsap.getProperty(logo, "y");

            // Read the resting state off a copy, so the live element keeps
            // the colours its current scroll position implies.
            const probe = logo.cloneNode(false);
            probe.classList.remove(LANDING);
            probe.removeAttribute("style");
            probe.removeAttribute("data-logo");
            probe.style.visibility = "hidden";
            logo.parentNode.appendChild(probe);

            const probeRect = probe.getBoundingClientRect();
            const probeStyle = getComputedStyle(probe);

            endWidth = probeRect.width;
            endY = startY + (probeRect.top - startRect.top);
            endColor = probeStyle.color;
            endBlend = probeStyle.mixBlendMode;

            probe.remove();
        };

        measure();

        const setResting = (resting) => {
            if (resting) {
                gsap.set(logo, {
                    color: endColor,
                    mixBlendMode: endBlend
                });
            } else {
                gsap.set(logo, { clearProps: "color,mixBlendMode" });
            }
        };

        const landingTween = gsap.to(logo, {
            width: () => endWidth,
            y: () => endY,
            ease: "none",
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom center",
                scrub: true,
                invalidateOnRefresh: true,

                onRefreshInit: measure,

                onLeave: () => setResting(true),
                onEnterBack: () => setResting(false)
            }
        });

        // Callbacks don't fire on a refresh, so sync the colours to
        // whatever the current scroll position is (e.g. reload mid-page).
        const syncResting = () => {
            setResting(landingTween.scrollTrigger.progress >= 1);
        };

        syncResting();
        ScrollTrigger.addEventListener("refresh", syncResting);
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
