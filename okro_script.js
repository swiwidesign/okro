window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Skip Lenis inside the Webflow Editor
  if (Webflow.env("editor") === undefined) {
    const lenis = new Lenis({
      autoRaf: false
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
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
  gsap.from('[data-logo="home"]', {
    width: "42.06rem",
    top: "50%",
    bottom: "auto",
    color: "var(--_theme---text)",
    mixBlendMode: "normal",
    yPercent: -65,
    ease: "none",
    scrollTrigger: {
      trigger: ".landing_hero_section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true
    }
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
});