window.addEventListener("DOMContentLoaded", (event) => {
    // LENIS
    "use strict";

    if (Webflow.env("editor") === undefined) {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.5,
            wheelMultiplier: 0.7,
            infinite: false,
            gestureOrientation: "vertical",
            normalizeWheel: false,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        $("[data-lenis-start]").on("click", function () {
            lenis.start();
        });
        $("[data-lenis-stop]").on("click", function () {
            lenis.stop();
        });
        $("[data-lenis-toggle]").on("click", function () {
            $(this).toggleClass("stop-scroll");
            if ($(this).hasClass("stop-scroll")) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        function connectToScrollTrigger() {
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
        // Uncomment this if using GSAP ScrollTrigger
        connectToScrollTrigger();
    }

    gsap.registerPlugin(ScrollTrigger);

    // GENERAL CODE
    //Loading

    // Code that runs on pageload
    gsap.to("[loader_out]", {
        xPercent: 100,
        duration: 0.8,
        delay: 0.2
    });

    // Code that runs on click of a link
    $(document).ready(function () {
        $("a").on("click", function (e) {
            if (
                $(this).prop("hostname") === window.location.host &&
                $(this).attr("href").indexOf("#") === -1 &&
                $(this).attr("target") !== "_blank"
            ) {
                e.preventDefault();
                let destination = $(this).attr("href");
                gsap.set("[loader_out]", {
                    xPercent: -100
                });
                gsap.to("[loader_out]", {
                    xPercent: 0,
                    duration: 0.8,
                    delay: 0.2,
                    onComplete: () => {
                        window.location = destination;
                    }
                });
            }
        });

        // On click of the back button
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
    });

    //MENU
    $("[menu-open]").on("click", function () {
        gsap.to("[menu-wrap]", {
            x: "0%",
            ease: "ease"
        });

        // Add a click event listener to the document to close the menu when clicking outside
        $(document).on("click.closeMenu", function (event) {
            if (!$(event.target).closest("[menu-wrap]").length && !$(event.target).closest("[menu-open]").length) {
                $("[menu-close]").trigger("click"); // Simulate a click on the menu-close button
            }
        });
    });

    $("[menu-close]").on("click", function () {
        gsap.to("[menu-wrap]", {
            x: "101%",
            ease: "ease"
        });
        $(document).off("click.closeMenu"); // Remove the event listener once the menu is closed
    });

    //LANDING
    let mm = gsap.matchMedia();

    mm.add(
        {
            // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
            isDesktop: "(min-width: 992px)",
            isMobile: "(max-width: 767px)"
        },
        (context) => {
            // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
            let { isDesktop, isMobile } = context.conditions;

            //Sequence Section
            let sequences = gsap.utils.toArray(".sequence_contain");

            sequences.forEach((sequence) => {
                let textWrap = sequence.querySelector(".sequence_text_wrap");

                gsap.from(textWrap, {
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sequence,
                        start: "top center",
                        end: "top top", // when the top of the sequence_contain reaches the center of the viewport
                        scrub: true // Play the animation when entering the viewport
                    }
                });
            });
        }
    );

    //END
});
