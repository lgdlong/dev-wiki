import {
  HeroSection,
  ProblemSolutionSection,
  FeaturesSection,
  PreviewSection,
  CTASection,
  LandingFooter,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <PreviewSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
