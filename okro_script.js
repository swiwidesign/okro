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
  const homeLogo = document.querySelector('[data-logo="home"]');

  if (homeLogo) {
    // mix-blend-mode can't be interpolated, so it's toggled at the end of the
    // scrub instead of tweened. Read it off CSS before GSAP writes inline styles.
    const logoBlend = getComputedStyle(homeLogo).mixBlendMode;
    const setBlend = (on) =>
      gsap.set(homeLogo, { mixBlendMode: on ? logoBlend : "normal" });

    setBlend(false);

    gsap.from(homeLogo, {
      width: "42.06rem",
      top: "50%",
      bottom: "auto",
      color: "var(--_theme---text)",
      yPercent: -65,
      ease: "none",
      scrollTrigger: {
        trigger: ".landing_hero_section",
        start: "top top",
        end: "bottom center",
        scrub: true,
        invalidateOnRefresh: true,
        onLeave: () => setBlend(true),
        onEnterBack: () => setBlend(false),
        onRefresh: (self) => setBlend(self.progress === 1)
      }
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
});