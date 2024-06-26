import Features from "../components/features";
import HeroSection from "../components/hero";
import Newsletter from "../components/newsletter";
import PropertiesPreview from "../components/preview";

export default function HomeScreen() {
  return (
    <main className="my-8 flex flex-col space-y-20">
      <HeroSection />
      <PropertiesPreview />
      <Features />
      <Newsletter />
    </main>
  );
}
