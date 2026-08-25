window.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------
    // GSAP
    // --------------------------------------------------

    gsap.registerPlugin(ScrollTrigger);



    // --------------------------------------------------
    // LANDING
    // --------------------------------------------------

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
                    color: "var(--_theme---background)"
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
