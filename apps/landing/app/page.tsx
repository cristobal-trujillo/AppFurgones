import { Caracteristicas } from "@/components/caracteristicas";
import { ComoFunciona } from "@/components/como-funciona";
import { Contacto } from "@/components/contacto";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Problema } from "@/components/problema";
import { Seguridad } from "@/components/seguridad";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Problema />
        <ComoFunciona />
        <Caracteristicas />
        <Seguridad />
        <Faq />
        <Contacto />
      </main>
      <SiteFooter />
    </>
  );
}
