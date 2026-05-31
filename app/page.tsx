import { About } from "@/components/sections/About";
import { AboutExperienceTransition } from "@/components/sections/AboutExperienceTransition";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { HeroAboutTransition } from "@/components/sections/HeroAboutTransition";
import { Contact } from "@/components/sections/Contact";
import { ExperienceInterestsTransition } from "@/components/sections/ExperienceInterestsTransition";
import { Interests } from "@/components/sections/Interests";

export default function Home() {
  return (
    <>
      <Hero />
      <HeroAboutTransition />
      <About />
      <AboutExperienceTransition />
      <Experience />
      <ExperienceInterestsTransition />
      <Interests />
      <Contact />
    </>
  );
}
