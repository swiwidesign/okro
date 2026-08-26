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

        // Scoped to the hero — there's a second .byline_wrap in the footer.
        const byline = hero.querySelector(".byline_wrap");

        // Hero look, applied up front: solid dark, no blending.
        // .nav_logo_wrap's own look (difference) is the nav look.
        gsap.set(logo, {
            mixBlendMode: "normal",
            color: "var(--swatch--dark)"
        });

        // The timeline is 1 unit long, so every position and duration below
        // reads straight off as a fraction of the hero scroll.
        gsap.timeline({
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true
                }
            })
            // 0 → 50%: shrink from hero size into the nav slot. The values
            // here are the start — GSAP animates back to what .nav_logo_wrap says.
            .from(logo, {
                width: "42.06rem",
                top: "50%",
                yPercent: -65,
                ease: "none",
                duration: 0.5
            }, 0)
            // 15% → 70%: the byline slides down and tilts out of the way.
            .to(byline, {
                yPercent: 150,
                rotation: "10deg",
                ease: "none",
                duration: 0.55
            }, 0.15)
            // 100%: back to the nav look. Scrubbing up reverts it on its own.
            // This also pins the timeline's length, so nothing above can drift.
            .set(logo, {
                mixBlendMode: "difference",
                color: "var(--swatch--light-2)"
            }, 1);
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
