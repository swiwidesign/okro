window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Skip Lenis inside the Webflow Editor
  if (Webflow.env("editor") === undefined) {
    const lenis = new Lenis({
      autoRaf: false
    });

    lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {

  lenis.raf(time * 1000);

});
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
    top: "var(--site--margin)",
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