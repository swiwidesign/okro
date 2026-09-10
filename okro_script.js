window.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------
    // GSAP
    // --------------------------------------------------

    gsap.registerPlugin(ScrollTrigger);


    // --------------------------------------------------
    // BREAKPOINTS
    // --------------------------------------------------

    // Mirrors the Webflow breakpoints — keep these in sync with the designer.
    // Use them anywhere below via mm.add(...), e.g.
    //
    //   mm.add(BREAKPOINTS, (ctx) => {
    //       const { isTabletUp } = ctx.conditions;
    //       if (!isTabletUp) return;
    //       ...tweens...
    //       return () => { /* cleanup */ };
    //   });
    //
    // The callback re-runs whenever any condition flips, and GSAP reverts
    // everything it created in there automatically.
    const BREAKPOINTS = {
        isDesktop: "(min-width: 992px)",
        isTablet: "(max-width: 991px) and (min-width: 768px)",
        isTabletUp: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
    };

    // One shared matchMedia for the whole file — a single revert point.
    const mm = gsap.matchMedia();


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
        const byline = hero.querySelector('[data-byline="hero"]');

        // The timeline is 1 unit long, so every position and duration below
        // reads straight off as a fraction of the hero scroll.
        gsap.timeline({
                scrollTrigger: {
                    trigger: hero,
                    start: "clamp(top top)",
                    end: "clamp(bottom top)",
                    scrub: true
                }
            })
            // 0 → 50%: shrink from hero size into the nav slot. The values
            // here are the start — GSAP animates back to what .nav_logo_wrap says.
            .from(logo, {
                width: "44rem",
                top: "50%",
                yPercent: -65,
                ease: "none",
                duration: 0.5
            }, 0)
            // 15% → 70%: the byline slides down and tilts out of the way.
            .to(byline, {
                yPercent: 150,
                rotation: 10,
                ease: "none",
                duration: 0.55
            }, 0.25);
    }


    // --------------------------------------------------
    // FOOTER
    // --------------------------------------------------

    const footer = document.querySelector(".footer_section_complete");
    const footerByline = document.querySelector('[data-byline="footer"]');

    if (footer && footerByline) {

        gsap.timeline({
                scrollTrigger: {
                    trigger: footer,
                    // Fires when the top of the footer reaches the middle
                    // of the viewport.
                    start: "top center",
                    toggleActions: "play none none reverse",
                    invalidateOnRefresh: true
                }
            })
            .from(footerByline, {
                yPercent: 150,
                rotation: 10,
                ease: "power2.out",
                duration: 1
            });
    }





    // --------------------------------------------------
    // HORIZONTAL
    // --------------------------------------------------

    const hWrap = document.querySelector('[data-hscroll="wrap"]');
    const hSticky = hWrap && hWrap.querySelector('[data-hscroll="sticky"]');
    const hTrack = hWrap && hWrap.querySelector('[data-hscroll="track"]');

    // Runs on tablet and up — below that the track stacks.
    if (hWrap && hSticky && hTrack) mm.add(BREAKPOINTS, (ctx) => {

        const {
            isTabletUp
        } = ctx.conditions;
        if (!isTabletUp) return;

        // The track measures one viewport narrower than its content (margin-right:
        // -100vw on .track_layout), which is exactly how far xPercent: -100 travels.
        // Adding the sticky height back gives a 1:1 scroll-to-travel ratio.
        const measure = () => {
            hWrap.style.height = hTrack.offsetWidth + hSticky.offsetHeight + "px";
        };

        // refreshInit runs the measurement inside ScrollTrigger's own cycle, so it
        // stays correct on resize and after images and fonts settle.
        ScrollTrigger.addEventListener("refreshInit", measure);
        measure();

        gsap.to(hTrack, {
            xPercent: -100,
            ease: "none",
            scrollTrigger: {
                trigger: hWrap,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });

        return () => {
            ScrollTrigger.removeEventListener("refreshInit", measure);
            hWrap.style.height = "";
        };
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
