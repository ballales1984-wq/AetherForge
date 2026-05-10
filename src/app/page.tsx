import { CinematicExperience } from "@/components/CinematicExperience";
import { Collection } from "@/components/Collection";
import { Commission } from "@/components/Commission";
import { DesignLab } from "@/components/DesignLab";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Showroom } from "@/components/Showroom";

export default function Home() {
  return (
    <>
      <CinematicExperience />
      <Header />
      <main>
        <Hero />
        <Collection />
        <Showroom />
        <DesignLab />
        <Commission />
      </main>
    </>
  );
}
