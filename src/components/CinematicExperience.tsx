"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function CinematicExperience() {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-line]",
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.12 },
      );

      gsap.to("[data-hero-image]", {
        scale: 1.12,
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        const animation = gsap.fromTo(
          element,
          { y: 36, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", paused: true },
        );

        ScrollTrigger.create({
          trigger: element,
          start: "top 88%",
          once: true,
          onEnter: () => animation.play(),
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => context.revert();
  }, []);

  return null;
}
