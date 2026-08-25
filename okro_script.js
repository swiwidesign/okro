window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

   if (Webflow.env("editor") === undefined) {

    const lenis = new Lenis({

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
      el.addEventListener("click", () => lenis.stop())
    );
    document.querySelectorAll("[data-lenis-start]").forEach((el) =>
      el.addEventListener("click", () => lenis.start())
    );

    // Lumos nav is a checkbox — listen for change, not click
    const lenisToggle = document.querySelector("[data-lenis-toggle]");
    if (lenisToggle) {
      lenisToggle.addEventListener("change", () => {
        lenisToggle.checked ? lenis.stop() : lenis.start();
      });
    }
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
      // Blend mode and colour both flip once, after the scrub is done
      onLeave: () =>
        gsap.set(logo, { mixBlendMode: "difference", color: "var(--_theme---text)" }),
      onEnterBack: () =>
        gsap.set(logo, { mixBlendMode: "normal", color: "var(--_theme---text)" })
    }
  });

  // All start states applied — reveal every [data-flicker] element (CSS in <head>)
  document.documentElement.setAttribute("data-flicker-ready", "");

  window.addEventListener("load", () => ScrollTrigger.refresh());
  // Webfonts settle after load and can shift the trigger bounds
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
});