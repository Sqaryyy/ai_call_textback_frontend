import FAQSection from "@/components/FAQ";
import FinalCTAAndFooter from "@/components/Footer";
import VoxioDeskHero from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorks";
import VoxioDeskProblem from "@/components/ProblemStatementSection";
import UseCasesSection from "@/components/UseCasesSection";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <VoxioDeskHero />
        <VoxioDeskProblem />
        <HowItWorksSection />
        <UseCasesSection />
        <FAQSection />
        <FinalCTAAndFooter />
      </div>
    </>
  );
}
