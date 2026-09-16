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
    // HORIZONTAL
    // --------------------------------------------------

    // Every section with data-hscroll="wrap" gets its own sideways scroll:
    // the landing page scroller and every Image Scroller Section on a page.
    // Below tablet nothing happens here (the Image Scroller cards become a
    // native swipe row instead — that's all CSS in Webflow).
    const hWraps = document.querySelectorAll('[data-hscroll="wrap"]');

    if (hWraps.length) mm.add(BREAKPOINTS, (ctx) => {
        if (!ctx.conditions.isTabletUp) return;

        // Set up in page order, so stacked pins measure each other correctly
        hWraps.forEach((hWrap) => {
            const track = hWrap.querySelector('[data-hscroll="track"]');

            // How far the track slides: whatever sticks out past its own right edge.
            // Landing page: the screen edge. Image Scroller: the container edge,
            // so the last card stops in line with the page grid.
            const distance = () => track.scrollWidth - track.clientWidth;

            // Pin the section and slide the track left while scrolling.
            // 1px of scroll = 1px of slide.
            const slide = gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                    trigger: hWrap,
                    pin: true,
                    // .page_wrap is flex, where GSAP turns spacing off by default
                    pinSpacing: true,
                    start: "top top",
                    end: () => "+=" + distance(),
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });

            // Pins hold at the left edge while their parent slides past, and let go
            // when the parent's right edge reaches them.
            hWrap.querySelectorAll('[data-hscroll="pin"]').forEach((pin) => {
                const parent = pin.parentElement;

                // Where the pin's right edge sits on screen while it's pinned
                const pinRight = () => pin.offsetLeft + pin.offsetWidth;

                gsap.to(pin, {
                    x: () => parent.offsetWidth - pinRight(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: parent,
                        containerAnimation: slide,
                        start: "left left",
                        end: () => "right " + pinRight() + "px",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });
            });

            // Scales pin at the left edge, then get revealed from the top-left corner
            // (clip-path, 40% → 100%).
            // Their section must be wider than the screen (e.g. 200vw) — the extra
            // width is how long they stay pinned.
            hWrap.querySelectorAll('[data-hscroll="scale"]').forEach((el) => {
                const section = el.closest(".u-section");

                // Hold at the left edge while the section slides past.
                // Must stay "left left" → "right right" so the counter-move matches.
                gsap.to(el, {
                    x: () => section.offsetWidth - hWrap.clientWidth,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: slide,
                        start: "left left",
                        end: "right right",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });

                // Reveal from the top-left corner. Tune start/end freely,
                // e.g. start while it's still coming in, finish halfway through the hold.
                // inset(top right bottom left): 60% cut from right and bottom = 40% visible
                gsap.fromTo(el, {
                    clipPath: "inset(0% 60% 60% 0%)"
                }, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: slide,
                        start: "left 40%",
                        end: "right right",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });
            });
        });
    });





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
