import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

export function AboutSection() {
  return (
    <section className="w-full pt-16 md:pt-24 lg:pt-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header — anchor target for #about. scroll-mt offsets the landing
            so the eyebrow lands just below the navbar, skipping the section's
            own pt above. */}
        <div id="about" className="text-center mb-0 md:mb-14 scroll-mt-[var(--nav-offset)]">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-4 font-medium">
            About Scale SD
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Marketing That Feels Real,<br />Fun &amp; Deeply Human.
          </h2>
        </div>

        {/* Orbital */}
        <RadialOrbitalTimeline />

      </div>
    </section>
  );
}
