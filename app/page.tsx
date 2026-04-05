import { HeroSection } from "@/components/blocks/hero-section-5";
import { FeatureCarousel } from "@/components/ui/feature-carousel";
import { StatsSection } from "@/components/ui/stats-section";
import CTAWithVerticalMarquee from "@/components/ui/cta-with-text-marquee";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Services */}
      <section id="services" className="w-full py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Transform Your Business</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From social media to paid ads — we handle all your marketing so you can focus on running your business.
          </p>
        </div>
        <FeatureCarousel />
      </section>

      {/* Section 3: Stats */}
      <StatsSection />

      {/* Section 4: Contact CTA */}
      <CTAWithVerticalMarquee />
    </div>
  );
}
